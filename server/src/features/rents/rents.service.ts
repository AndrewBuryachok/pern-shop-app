import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Rent } from './rent.entity';

@Injectable()
export class RentsService {
  constructor(
    @InjectRepository(Rent)
    private rentsRepository: Repository<Rent>,
  ) {}

  getMyRents(myId: number): Promise<Rent[]> {
    return this.getRentsQueryBuilder()
      .where('renterUser.id = :myId OR lessorUser.id = :myId', { myId })
      .getMany();
  }

  getAllRents(): Promise<Rent[]> {
    return this.getRentsQueryBuilder().getMany();
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
