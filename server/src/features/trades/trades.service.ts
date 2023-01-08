import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Trade } from './trade.entity';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private tradesRepository: Repository<Trade>,
  ) {}

  private getTradesQueryBuilder(): SelectQueryBuilder<Trade> {
    return this.tradesRepository
      .createQueryBuilder('trade')
      .innerJoin('trade.ware', 'ware')
      .innerJoin('ware.rent', 'rent')
      .innerJoin('rent.store', 'store')
      .innerJoin('store.market', 'market')
      .innerJoin('rent.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .innerJoin('trade.card', 'buyerCard')
      .innerJoin('buyerCard.user', 'buyerUser')
      .orderBy('trade.id', 'DESC')
      .select([
        'trade.id',
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
        'ware.intake',
        'ware.kit',
        'ware.price',
        'buyerCard.id',
        'buyerUser.id',
        'buyerUser.name',
        'buyerCard.name',
        'buyerCard.color',
        'trade.amount',
        'trade.createdAt',
      ]);
  }
}
