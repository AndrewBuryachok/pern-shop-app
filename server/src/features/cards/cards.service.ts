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

  selectUserCards(userId: number): Promise<Card[]> {
    return this.selectCardsQueryBuilder(userId).getMany();
  }

  selectUserCardsWithBalance(userId: number): Promise<Card[]> {
    return this.selectCardsQueryBuilder(userId)
      .addSelect(['card.balance'])
      .getMany();
  }

  private selectCardsQueryBuilder(userId: number): SelectQueryBuilder<Card> {
    return this.cardsRepository
      .createQueryBuilder('card')
      .where('card.userId = :userId', { userId })
      .orderBy('card.name', 'ASC')
      .select(['card.id', 'card.name']);
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
