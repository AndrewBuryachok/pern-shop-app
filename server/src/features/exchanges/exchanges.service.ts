import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Exchange } from './exchange.entity';

@Injectable()
export class ExchangesService {
  constructor(
    @InjectRepository(Exchange)
    private exchangesRepository: Repository<Exchange>,
  ) {}

  private getExchangesQueryBuilder(): SelectQueryBuilder<Exchange> {
    return this.exchangesRepository
      .createQueryBuilder('exchange')
      .innerJoin('exchange.executorUser', 'executorUser')
      .innerJoin('exchange.customerCard', 'customerCard')
      .innerJoin('customerCard.user', 'customerUser')
      .orderBy('exchange.id', 'DESC')
      .select([
        'exchange.id',
        'executorUser.id',
        'executorUser.name',
        'customerCard.id',
        'customerUser.id',
        'customerUser.name',
        'customerCard.name',
        'customerCard.color',
        'exchange.type',
        'exchange.sum',
        'exchange.createdAt',
      ]);
  }
}
