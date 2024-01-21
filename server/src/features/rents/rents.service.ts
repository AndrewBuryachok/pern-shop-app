import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Rent } from './rent.entity';
import { Thing } from '../things/thing.entity';
import { StoresService } from '../stores/stores.service';
import { CompleteRentDto, ExtCreateRentDto } from './rent.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAfter } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { RentError } from './rent-error.enum';
import { Mode } from '../../common/enums';

@Injectable()
export class RentsService {
  constructor(
    @InjectRepository(Rent)
    private rentsRepository: Repository<Rent>,
    private storesService: StoresService,
  ) {}

  async getMainRents(req: Request): Promise<Response<Rent>> {
    const [result, count] = await this.getRentsQueryBuilder(req)
      .andWhere('rent.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyRents(myId: number, req: Request): Promise<Response<Rent>> {
    const [result, count] = await this.getRentsQueryBuilder(req)
      .innerJoin('renterCard.users', 'renterUsers')
      .andWhere('renterUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedRents(myId: number, req: Request): Promise<Response<Rent>> {
    const [result, count] = await this.getRentsQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllRents(req: Request): Promise<Response<Rent>> {
    const [result, count] = await this.getRentsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectAllRents(): Promise<Rent[]> {
    return this.selectRentsQueryBuilder().getMany();
  }

  selectMyRents(myId: number): Promise<Rent[]> {
    return this.selectRentsQueryBuilder()
      .innerJoin('rent.card', 'renterCard')
      .innerJoin('renterCard.users', 'renterUsers')
      .andWhere('renterUsers.id = :myId', { myId })
      .getMany();
  }

  async selectRentThings(rentId: number): Promise<Thing[]> {
    const rent = await this.rentsRepository
      .createQueryBuilder('rent')
      .leftJoin('rent.wares', 'ware')
      .where('rent.id = :rentId', { rentId })
      .orderBy('ware.id', 'DESC')
      .select([
        'rent.id',
        'ware.id',
        'ware.item',
        'ware.description',
        'ware.amount',
        'ware.intake',
        'ware.kit',
        'ware.price',
      ])
      .getOne();
    return rent.wares;
  }

  async createRent(dto: ExtCreateRentDto): Promise<void> {
    await this.storesService.reserveStore(dto);
    await this.create(dto);
  }

  async completeRent(dto: CompleteRentDto): Promise<void> {
    const rent = await this.checkRentOwner(dto.rentId, dto.myId, dto.hasRole);
    await this.storesService.unreserveStore(rent.storeId);
    await this.complete(rent);
  }

  async checkRentExists(id: number): Promise<void> {
    await this.rentsRepository.findOneByOrFail({ id });
  }

  async checkRentOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Rent> {
    const rent = await this.rentsRepository.findOne({
      relations: ['card', 'card.users'],
      where: { id },
    });
    if (!rent.card.users.map((user) => user.id).includes(userId) && !hasRole) {
      throw new AppException(RentError.NOT_OWNER);
    }
    if (rent.completedAt < new Date()) {
      throw new AppException(RentError.ALREADY_COMPLETED);
    }
    return rent;
  }

  private async create(dto: ExtCreateRentDto): Promise<void> {
    try {
      const rent = this.rentsRepository.create({
        storeId: dto.storeId,
        cardId: dto.cardId,
        completedAt: getDateWeekAfter(),
      });
      await this.rentsRepository.save(rent);
    } catch (error) {
      throw new AppException(RentError.CREATE_FAILED);
    }
  }

  private async complete(rent: Rent): Promise<void> {
    try {
      rent.completedAt = new Date();
      await this.rentsRepository.save(rent);
    } catch (error) {
      throw new AppException(RentError.COMPLETE_FAILED);
    }
  }

  private selectRentsQueryBuilder(): SelectQueryBuilder<Rent> {
    return this.rentsRepository
      .createQueryBuilder('rent')
      .innerJoin('rent.store', 'store')
      .innerJoin('store.market', 'market')
      .where('rent.completedAt > NOW()')
      .orderBy('rent.id', 'DESC')
      .select([
        'rent.id',
        'store.id',
        'market.id',
        'market.name',
        'market.x',
        'market.y',
        'store.name',
      ]);
  }

  private getRentsQueryBuilder(req: Request): SelectQueryBuilder<Rent> {
    return this.rentsRepository
      .createQueryBuilder('rent')
      .innerJoin('rent.store', 'store')
      .innerJoin('store.market', 'market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('rent.card', 'renterCard')
      .innerJoin('renterCard.user', 'renterUser')
      .leftJoin('market.states', 'state', 'state.createdAt < rent.createdAt')
      .leftJoin(
        'market.states',
        'next',
        'state.createdAt < next.createdAt AND next.createdAt < rent.createdAt',
      )
      .loadRelationCountAndMap('rent.things', 'rent.wares')
      .where('next.id IS NULL')
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('rent.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.RENTER}`)
                  .andWhere('renterUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.OWNER}`)
                  .andWhere('ownerUser.id = :userId'),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.card}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.RENTER}`)
                  .andWhere('renterCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.OWNER}`)
                  .andWhere('ownerCard.id = :cardId'),
              ),
            ),
        ),
        { cardId: req.card },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.market}`)
            .orWhere('market.id = :marketId', { marketId: req.market }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.store}`)
            .orWhere('store.id = :storeId', { storeId: req.store }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('state.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('state.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('rent.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('rent.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('rent.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'rent.id',
        'store.id',
        'market.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'ownerCard.name',
        'ownerCard.color',
        'market.name',
        'market.x',
        'market.y',
        'state.price',
        'store.name',
        'renterCard.id',
        'renterUser.id',
        'renterUser.nick',
        'renterUser.avatar',
        'renterCard.name',
        'renterCard.color',
        'rent.createdAt',
        'rent.completedAt',
      ]);
  }
}
