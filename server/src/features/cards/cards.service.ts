import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Card } from './card.entity';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  private getCardsQueryBuilder(): SelectQueryBuilder<Card> {
    return this.cardsRepository
      .createQueryBuilder('card')
      .innerJoin('card.user', 'ownerUser')
      .orderBy('card.id', 'DESC')
      .select([
        'card.id',
        'ownerUser.id',
        'ownerUser.name',
        'card.name',
        'card.color',
        'card.balance',
      ]);
  }
}
