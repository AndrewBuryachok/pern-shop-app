import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Market } from './market.entity';

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(Market)
    private marketsRepository: Repository<Market>,
  ) {}

  getMainMarkets(): Promise<Market[]> {
    return this.getMarketsQueryBuilder().getMany();
  }

  getMyMarkets(myId: number): Promise<Market[]> {
    return this.getMarketsQueryBuilder()
      .where('ownerUser.id = :myId', { myId })
      .getMany();
  }

  getAllMarkets(): Promise<Market[]> {
    return this.getMarketsQueryBuilder().getMany();
  }

  private getMarketsQueryBuilder(): SelectQueryBuilder<Market> {
    return this.marketsRepository
      .createQueryBuilder('market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .leftJoinAndMapMany(
        'market.stores',
        'stores',
        'store',
        'market.id = store.marketId',
      )
      .orderBy('market.id', 'DESC')
      .addOrderBy('store.id', 'ASC')
      .select([
        'market.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.name',
        'ownerCard.name',
        'ownerCard.color',
        'market.name',
        'market.x',
        'market.y',
        'market.price',
        'store.id',
        'store.name',
      ]);
  }
}
