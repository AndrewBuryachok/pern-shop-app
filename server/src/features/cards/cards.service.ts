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

  getMyCards(myId: number): Promise<Card[]> {
    return this.getCardsQueryBuilder()
      .where('ownerUser.id = :myId', { myId })
      .getMany();
  }

  getAllCards(): Promise<Card[]> {
    return this.getCardsQueryBuilder().getMany();
  }

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
