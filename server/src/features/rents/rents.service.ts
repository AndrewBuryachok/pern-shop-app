import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Rent } from './rent.entity';
import { StoresService } from '../stores/stores.service';
import { ExtCreateRentDto } from './rent.dto';
import { AppException } from '../../common/exceptions';
import { RentError } from './rent-error.enum';

@Injectable()
export class RentsService {
  constructor(
    @InjectRepository(Rent)
    private rentsRepository: Repository<Rent>,
    private storesService: StoresService,
  ) {}

  getMyRents(myId: number): Promise<Rent[]> {
    return this.getRentsQueryBuilder()
      .where('renterUser.id = :myId OR lessorUser.id = :myId', { myId })
      .getMany();
  }

  getAllRents(): Promise<Rent[]> {
    return this.getRentsQueryBuilder().getMany();
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

  private getRentsQueryBuilder(): SelectQueryBuilder<Rent> {
    return this.rentsRepository
      .createQueryBuilder('rent')
      .innerJoin('rent.store', 'store')
      .innerJoin('store.market', 'market')
      .innerJoin('market.card', 'lessorCard')
      .innerJoin('lessorCard.user', 'lessorUser')
      .innerJoin('rent.card', 'renterCard')
      .innerJoin('renterCard.user', 'renterUser')
      .leftJoinAndMapMany(
        'rent.wares',
        'wares',
        'ware',
        'rent.id = ware.rentId',
      )
      .orderBy('rent.id', 'DESC')
      .addOrderBy('ware.id', 'ASC')
      .select([
        'rent.id',
        'store.id',
        'market.id',
        'lessorCard.id',
        'lessorUser.id',
        'lessorUser.name',
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
        'renterCard.name',
        'renterCard.color',
        'rent.createdAt',
        'ware.id',
        'ware.item',
      ]);
  }
}
