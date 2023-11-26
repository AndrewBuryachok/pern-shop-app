import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Card } from './card.entity';
import { User } from '../users/user.entity';
import {
  ExtCreateCardDto,
  ExtEditCardDto,
  ExtUpdateCardUserDto,
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
      .innerJoin('card.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    await this.loadUsers(result);
    return { result, count };
  }

  async getAllCards(req: Request): Promise<Response<Card>> {
    const [result, count] = await this.getCardsQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadUsers(result);
    return { result, count };
  }

  selectUserCards(userId: number): Promise<Card[]> {
    return this.selectCardsQueryBuilder(userId).getMany();
  }

  selectUserCardsWithBalance(userId: number): Promise<Card[]> {
    return this.selectCardsQueryBuilder(userId)
      .addSelect('card.balance')
      .getMany();
  }

  async createCard(dto: ExtCreateCardDto): Promise<void> {
    await this.checkHasNotEnough(dto.userId);
    await this.checkNameNotUsed(dto.userId, dto.name);
    await this.create(dto);
  }

  async editCard(dto: ExtEditCardDto): Promise<void> {
    const card = await this.checkCardOwner(dto.cardId, dto.myId, dto.hasRole);
    await this.checkNameNotUsed(dto.myId, dto.name, dto.cardId);
    await this.edit(card, dto);
  }

  async addCardUser(dto: ExtUpdateCardUserDto): Promise<void> {
    const card = await this.checkCardOwner(dto.cardId, dto.myId, dto.hasRole);
    if (card.users.map((user) => user.id).includes(dto.userId)) {
      throw new AppException(CardError.ALREADY_IN_CARD);
    }
    await this.addUser(card, dto.userId);
  }

  async removeCardUser(dto: ExtUpdateCardUserDto): Promise<void> {
    const card = await this.checkCardOwner(dto.cardId, dto.myId, dto.hasRole);
    if (dto.userId === dto.myId) {
      throw new AppException(CardError.OWNER);
    }
    if (!card.users.map((user) => user.id).includes(dto.userId)) {
      throw new AppException(CardError.NOT_IN_CARD);
    }
    await this.removeUser(card, dto.userId);
  }

  async increaseCardBalance(dto: UpdateCardBalanceDto): Promise<Card> {
    const card = await this.cardsRepository.findOneBy({ id: dto.cardId });
    if (card.balance + dto.sum > MAX_CARD_BALANCE) {
      throw new AppException(CardError.ALREADY_ENOUGH_BALANCE);
    }
    await this.increaseBalance(card, dto.sum);
    return card;
  }

  async decreaseCardBalance(dto: UpdateCardBalanceDto): Promise<Card> {
    const card = await this.cardsRepository.findOneBy({ id: dto.cardId });
    if (card.balance - dto.sum < MIN_CARD_BALANCE) {
      throw new AppException(CardError.NOT_ENOUGH_BALANCE);
    }
    await this.decreaseBalance(card, dto.sum);
    return card;
  }

  async checkCardExists(id: number): Promise<void> {
    await this.cardsRepository.findOneByOrFail({ id });
  }

  async checkCardOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      relations: ['users'],
      where: { id },
    });
    if (card.userId !== userId && !hasRole) {
      throw new AppException(CardError.NOT_OWNER);
    }
    return card;
  }

  async checkCardUser(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      relations: ['users'],
      where: { id },
    });
    if (!card.users.map((user) => user.id).includes(userId) && !hasRole) {
      throw new AppException(CardError.NOT_USER);
    }
    return card;
  }

  private async checkHasNotEnough(userId: number): Promise<void> {
    const count = await this.cardsRepository.countBy({ userId });
    if (count === MAX_CARDS_NUMBER) {
      throw new AppException(CardError.ALREADY_HAS_ENOUGH);
    }
  }

  private async checkNameNotUsed(
    userId: number,
    name: string,
    id?: number,
  ): Promise<void> {
    const card = await this.cardsRepository.findOneBy({ userId, name });
    if (card && (!id || card.id !== id)) {
      throw new AppException(CardError.NAME_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateCardDto): Promise<void> {
    try {
      const card = this.cardsRepository.create({
        userId: dto.userId,
        name: dto.name,
        color: dto.color,
        users: [{ id: dto.userId }],
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

  private async addUser(card: Card, userId: number): Promise<void> {
    try {
      const user = new User();
      user.id = userId;
      card.users.push(user);
      await this.cardsRepository.save(card);
    } catch (error) {
      throw new AppException(CardError.ADD_USER_FAILED);
    }
  }

  private async removeUser(card: Card, userId: number): Promise<void> {
    try {
      card.users = card.users.filter((user) => user.id !== userId);
      await this.cardsRepository.save(card);
    } catch (error) {
      throw new AppException(CardError.REMOVE_USER_FAILED);
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

  private async decreaseBalance(card: Card, sum: number): Promise<void> {
    try {
      card.balance -= sum;
      await this.cardsRepository.save(card);
    } catch (error) {
      throw new AppException(CardError.DECREASE_BALANCE_FAILED);
    }
  }

  private selectCardsQueryBuilder(userId: number): SelectQueryBuilder<Card> {
    return this.cardsRepository
      .createQueryBuilder('card')
      .innerJoin('card.user', 'ownerUser')
      .innerJoin('card.users', 'ownerUsers')
      .where('ownerUsers.id = :userId', { userId })
      .orderBy('card.name', 'ASC')
      .select([
        'card.id',
        'ownerUser.id',
        'ownerUser.name',
        'card.name',
        'card.color',
      ]);
  }

  private async loadUsers(cards: Card[]): Promise<void> {
    const promises = cards.map(async (card) => {
      card.users = (
        await this.cardsRepository
          .createQueryBuilder('card')
          .leftJoin('card.users', 'user')
          .where('card.id = :cardId', { cardId: card.id })
          .orderBy('user.name', 'ASC')
          .select(['card.id', 'user.id', 'user.name'])
          .getOne()
      ).users;
    });
    await Promise.all(promises);
  }

  private getCardsQueryBuilder(req: Request): SelectQueryBuilder<Card> {
    return this.cardsRepository
      .createQueryBuilder('card')
      .innerJoin('card.user', 'ownerUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere('ownerUser.id = :userId', { userId: req.user }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.card}`)
            .orWhere('card.id = :cardId', { cardId: req.card }),
        ),
      )
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
