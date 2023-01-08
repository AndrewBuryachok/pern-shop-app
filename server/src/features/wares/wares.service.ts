import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Ware } from './ware.entity';
import { getDateWeekAgo } from '../../common/utils';

@Injectable()
export class WaresService {
  constructor(
    @InjectRepository(Ware)
    private waresRepository: Repository<Ware>,
  ) {}

  getMainWares(): Promise<Ware[]> {
    return this.getWaresQueryBuilder()
      .where('ware.amountNow > 0 AND rent.createdAt > :createdAt', {
        createdAt: getDateWeekAgo(),
      })
      .getMany();
  }

  getMyWares(myId: number): Promise<Ware[]> {
    return this.getWaresQueryBuilder()
      .where('sellerUser.id = :myId', { myId })
      .getMany();
  }

  getPlacedWares(myId: number): Promise<Ware[]> {
    return this.getWaresQueryBuilder()
      .innerJoin('market.card', 'ownerCard')
      .where('ownerCard.userId = :myId', { myId })
      .getMany();
  }

  getAllWares(): Promise<Ware[]> {
    return this.getWaresQueryBuilder().getMany();
  }

  private getWaresQueryBuilder(): SelectQueryBuilder<Ware> {
    return this.waresRepository
      .createQueryBuilder('ware')
      .innerJoin('ware.rent', 'rent')
      .innerJoin('rent.store', 'store')
      .innerJoin('store.market', 'market')
      .innerJoin('rent.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .orderBy('ware.id', 'DESC')
      .select([
        'ware.id',
        'rent.id',
        'store.id',
        'market.id',
        'market.name',
        'market.x',
        'market.y',
        'store.name',
        'sellerCard.id',
        'sellerUser.id',
        'sellerUser.name',
        'sellerCard.name',
        'sellerCard.color',
        'ware.item',
        'ware.description',
        'ware.amountNow',
        'ware.amountAll',
        'ware.intake',
        'ware.kit',
        'ware.price',
        'ware.createdAt',
      ]);
  }
}
