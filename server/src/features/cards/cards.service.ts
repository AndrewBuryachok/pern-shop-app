import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Card } from './card.entity';
import {
  ExtCreateCardDto,
  ExtEditCardDto,
  UpdateCardBalanceDto,
} from './card.dto';
import { Request, Response } from '../../common/interfaces';
import {
  MAX_CARDS_NUMBER,
  MAX_CARD_BALANCE,
  MIN_CARD_BALANCE,
} from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { CardError } from './card-error.enum';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
  ) {}

  async getMyCards(myId: number, req: Request): Promise<Response<Card>> {
    const [result, count] = await this.getCardsQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllCards(req: Request): Promise<Response<Card>> {
    const [result, count] = await this.getCardsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectUserCards(userId: number): Promise<Card[]> {
    return this.selectCardsQueryBuilder(userId).getMany();
  }

  selectUserCardsWithBalance(userId: number): Promise<Card[]> {
    return this.selectCardsQueryBuilder(userId)
      .addSelect(['card.balance'])
      .getMany();
  }

  async createCard(dto: ExtCreateCardDto): Promise<void> {
    await this.checkHasNotEnough(dto.myId);
    await this.checkNameNotUsed(dto.myId, dto.name);
    await this.create(dto);
  }

  async editCard(dto: ExtEditCardDto): Promise<void> {
    const card = await this.checkCardOwner(dto.cardId, dto.myId);
    await this.edit(card, dto);
  }

  async increaseCardBalance(dto: UpdateCardBalanceDto): Promise<void> {
    const card = await this.cardsRepository.findOneBy({ id: dto.cardId });
    if (card.balance + dto.sum > MAX_CARD_BALANCE) {
      throw new AppException(CardError.ALREADY_ENOUGH_BALANCE);
    }
    await this.increaseBalance(card, dto.sum);
  }

  async reduceCardBalance(dto: UpdateCardBalanceDto): Promise<void> {
    const card = await this.cardsRepository.findOneBy({ id: dto.cardId });
    if (card.balance - dto.sum < MIN_CARD_BALANCE) {
      throw new AppException(CardError.NOT_ENOUGH_BALANCE);
    }
    await this.reduceBalance(card, dto.sum);
  }

  async checkCardExists(id: number): Promise<void> {
    await this.cardsRepository.findOneByOrFail({ id });
  }

  async checkCardOwner(id: number, userId: number): Promise<Card> {
    const card = await this.cardsRepository.findOneBy({ id, userId });
    if (!card) {
      throw new AppException(CardError.NOT_OWNER);
    }
    return card;
  }

  private async checkHasNotEnough(userId: number): Promise<void> {
    const count = await this.cardsRepository.countBy({ userId });
    if (count === MAX_CARDS_NUMBER) {
      throw new AppException(CardError.ALREADY_HAS_ENOUGH);
    }
  }

  private async checkNameNotUsed(userId: number, name: string): Promise<void> {
    const card = await this.cardsRepository.findOneBy({ userId, name });
    if (card) {
      throw new AppException(CardError.NAME_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateCardDto): Promise<void> {
    try {
      const card = this.cardsRepository.create({
        userId: dto.myId,
        name: dto.name,
        color: dto.color,
      });
      await this.cardsRepository.save(card);
    } catch (error) {
      throw new AppException(CardError.CREATE_FAILED);
    }
  }

  private async edit(card: Card, dto: ExtEditCardDto): Promise<void> {
    try {
      card.name = dto.name;
      card.color = dto.color;
      await this.cardsRepository.save(card);
    } catch (error) {
      throw new AppException(CardError.EDIT_FAILED);
    }
  }

  private async increaseBalance(card: Card, sum: number): Promise<void> {
    try {
      card.balance += sum;
      await this.cardsRepository.save(card);
    } catch (error) {
      throw new AppException(CardError.INCREASE_BALANCE_FAILED);
    }
  }

  private async reduceBalance(card: Card, sum: number): Promise<void> {
    try {
      card.balance -= sum;
      await this.cardsRepository.save(card);
    } catch (error) {
      throw new AppException(CardError.REDUCE_BALANCE_FAILED);
    }
  }

  private selectCardsQueryBuilder(userId: number): SelectQueryBuilder<Card> {
    return this.cardsRepository
      .createQueryBuilder('card')
      .where('card.userId = :userId', { userId })
      .orderBy('card.name', 'ASC')
      .select(['card.id', 'card.name']);
  }

  private getCardsQueryBuilder(req: Request): SelectQueryBuilder<Card> {
    return this.cardsRepository
      .createQueryBuilder('card')
      .innerJoin('card.user', 'ownerUser')
      .where('ownerUser.name ILIKE :search', {
        search: `%${req.search || ''}%`,
      })
      .orderBy('card.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
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
