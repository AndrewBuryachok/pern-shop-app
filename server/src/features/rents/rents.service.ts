import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Rent } from './rent.entity';
import { StoresService } from '../stores/stores.service';
import { ExtCreateRentDto } from './rent.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { RentError } from './rent-error.enum';

@Injectable()
export class RentsService {
  constructor(
    @InjectRepository(Rent)
    private rentsRepository: Repository<Rent>,
    private storesService: StoresService,
  ) {}

  async getMyRents(myId: number, req: Request): Promise<Response<Rent>> {
    const [result, count] = await this.getRentsQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb.where('renterUser.id = :myId').orWhere('lessorUser.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    await this.loadWares(result);
    return { result, count };
  }

  async getAllRents(req: Request): Promise<Response<Rent>> {
    const [result, count] = await this.getRentsQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadWares(result);
    return { result, count };
  }

  selectMyRents(myId: number): Promise<Rent[]> {
    return this.selectRentsQueryBuilder()
      .innerJoin('rent.card', 'renterCard')
      .where('renterCard.userId = :myId', { myId })
      .getMany();
  }

  async createRent(dto: ExtCreateRentDto): Promise<void> {
    await this.storesService.reserveStore(dto);
    await this.create(dto);
  }

  async checkRentExists(id: number): Promise<void> {
    await this.rentsRepository.findOneByOrFail({ id });
  }

  async checkRentOwner(id: number, userId: number): Promise<Rent> {
    const rent = await this.rentsRepository.findOneBy({
      id,
      card: { userId },
    });
    if (!rent) {
      throw new AppException(RentError.NOT_OWNER);
    }
    return rent;
  }

  private async create(dto: ExtCreateRentDto): Promise<void> {
    try {
      const rent = this.rentsRepository.create({
        storeId: dto.storeId,
        cardId: dto.cardId,
      });
      await this.rentsRepository.save(rent);
    } catch (error) {
      throw new AppException(RentError.CREATE_FAILED);
    }
  }

  private selectRentsQueryBuilder(): SelectQueryBuilder<Rent> {
    return this.rentsRepository
      .createQueryBuilder('rent')
      .innerJoin('rent.store', 'store')
      .innerJoin('store.market', 'market')
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

  private async loadWares(rents: Rent[]): Promise<void> {
    const promises = rents.map(async (rent) => {
      rent['wares'] = (
        await this.rentsRepository
          .createQueryBuilder('rent')
          .leftJoinAndMapMany(
            'rent.wares',
            'wares',
            'ware',
            'rent.id = ware.rentId',
          )
          .where('rent.id = :rentId', { rentId: rent.id })
          .orderBy('ware.id', 'ASC')
          .select(['rent.id', 'ware.id', 'ware.item', 'ware.description'])
          .getOne()
      )['wares'];
    });
    await Promise.all(promises);
  }

  private getRentsQueryBuilder(req: Request): SelectQueryBuilder<Rent> {
    return this.rentsRepository
      .createQueryBuilder('rent')
      .innerJoin('rent.store', 'store')
      .innerJoin('store.market', 'market')
      .innerJoin('market.card', 'lessorCard')
      .innerJoin('lessorCard.user', 'lessorUser')
      .innerJoin('rent.card', 'renterCard')
      .innerJoin('renterCard.user', 'renterUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode}`)
                  .andWhere(
                    `renterUser.id ${
                      req.filters.includes('renter') ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `lessorUser.id ${
                      req.filters.includes('lessor') ? '=' : '!='
                    } :userId`,
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes('renter')}`)
                              .andWhere('renterUser.id = :userId'),
                          ),
                        )
                        .orWhere(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes('lessor')}`)
                              .andWhere('lessorUser.id = :userId'),
                          ),
                        ),
                    ),
                  ),
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
                  .where(`${req.mode}`)
                  .andWhere(
                    `renterCard.id ${
                      req.filters.includes('renter') ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `lessorCard.id ${
                      req.filters.includes('lessor') ? '=' : '!='
                    } :cardId`,
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes('renter')}`)
                              .andWhere('renterCard.id = :cardId'),
                          ),
                        )
                        .orWhere(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes('lessor')}`)
                              .andWhere('lessorCard.id = :cardId'),
                          ),
                        ),
                    ),
                  ),
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
      .orderBy('rent.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'rent.id',
        'store.id',
        'market.id',
        'lessorCard.id',
        'lessorUser.id',
        'lessorUser.name',
        'lessorUser.status',
        'lessorCard.name',
        'lessorCard.color',
        'market.name',
        'market.x',
        'market.y',
        'market.price',
        'store.name',
        'renterCard.id',
        'renterUser.id',
        'renterUser.name',
        'renterUser.status',
        'renterCard.name',
        'renterCard.color',
        'rent.createdAt',
      ]);
  }
}
