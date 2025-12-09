import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Account } from './account.entity';
import { Card } from './card.entity';
import { User } from '../users/user.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateCardDto,
  ExtEditCardDto,
  ExtUpdateCardUserDto,
  UpdateCardBalanceDto,
} from './card.dto';
import { Request, Response } from '../../common/interfaces';
import { MAX_CARD_BALANCE, MIN_CARD_BALANCE } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { CardError } from './card-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    @InjectRepository(Card)
    private cardsRepository: Repository<Card>,
    private mqttService: MqttService,
  ) {}

  async getMyCards(myId: number, req: Request): Promise<Response<Card>> {
    const [result, count] = await this.getCardsQueryBuilder(req)
      .andWhere('card.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllCards(req: Request): Promise<Response<Card>> {
    const [result, count] = await this.getCardsQueryBuilder(req)
      .andWhere('card.userId = account.userId')
      .getManyAndCount();
    return { result, count };
  }

  selectUserCards(userId: number): Promise<Card[]> {
    return this.selectCardsQueryBuilder(userId).getMany();
  }

  selectUserCardsWithBalance(userId: number): Promise<Card[]> {
    return this.selectCardsQueryBuilder(userId)
      .addSelect('account.balance')
      .getMany();
  }

  async selectCardUsers(cardId: number): Promise<User[]> {
    const card = await this.cardsRepository
      .createQueryBuilder('card')
      .innerJoin('card.account', 'account')
      .leftJoin('account.cards', 'subCard', 'subCard.completedAt IS NULL')
      .leftJoin('subCard.user', 'user')
      .where('card.id = :cardId', { cardId })
      .orderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.nick', 'ASC')
      .select([
        'card.id',
        'account.id',
        'subCard.id',
        'user.id',
        'user.nick',
        'user.avatar',
      ])
      .getOne();
    return card.account.cards.map((card) => card.user);
  }

  async createCard(dto: ExtCreateCardDto): Promise<void> {
    await this.create(dto);
  }

  async editCard(dto: ExtEditCardDto): Promise<void> {
    const card = await this.checkCardOwner(dto.cardId, dto.myId, dto.hasRole);
    await this.edit(card.account, dto);
  }

  async addCardUser(dto: ExtUpdateCardUserDto): Promise<void> {
    const card = await this.checkCardOwner(dto.cardId, dto.myId, dto.hasRole);
    if (await this.findCardByAccountAndUser(card.accountId, dto.userId)) {
      throw new AppException(CardError.ALREADY_IN_CARD);
    }
    const subCard = await this.addUser(card.accountId, dto.userId);
    this.mqttService.publishNotification(
      subCard.id,
      dto.userId,
      card.account.userId,
      Notification.ADDED_CARD,
    );
  }

  async removeCardUser(dto: ExtUpdateCardUserDto): Promise<void> {
    const card = await this.checkCardOwner(dto.cardId, dto.myId, dto.hasRole);
    if (dto.userId === dto.myId) {
      throw new AppException(CardError.OWNER);
    }
    const subCard = await this.findCardByAccountAndUser(
      card.accountId,
      dto.userId,
    );
    if (!subCard) {
      throw new AppException(CardError.NOT_IN_CARD);
    }
    await this.removeUser(subCard);
    this.mqttService.publishNotification(
      subCard.id,
      dto.userId,
      card.account.userId,
      Notification.REMOVED_CARD,
    );
  }

  async increaseCardBalance(dto: UpdateCardBalanceDto): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      relations: ['account'],
      where: { id: dto.cardId },
    });
    if (card.account.balance + dto.sum > MAX_CARD_BALANCE) {
      throw new AppException(CardError.ALREADY_ENOUGH_BALANCE);
    }
    await this.increaseBalance(card.account, dto.sum);
    return card;
  }

  async decreaseCardBalance(dto: UpdateCardBalanceDto): Promise<Card> {
    const card = await this.cardsRepository.findOne({
      relations: ['account'],
      where: { id: dto.cardId },
    });
    if (card.account.balance - dto.sum < MIN_CARD_BALANCE) {
      throw new AppException(CardError.NOT_ENOUGH_BALANCE);
    }
    await this.decreaseBalance(card.account, dto.sum);
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
      relations: ['account'],
      where: { id },
    });
    if (card.account.userId !== userId && !hasRole) {
      throw new AppException(CardError.NOT_OWNER);
    }
    return card;
  }

  async checkCardUser(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Card> {
    const card = await this.cardsRepository.findOneBy({ id });
    if (card.userId !== userId && !hasRole) {
      throw new AppException(CardError.NOT_USER);
    }
    return card;
  }

  private findCardByAccountAndUser(
    accountId: number,
    userId: number,
  ): Promise<Card> {
    return this.cardsRepository.findOneBy({
      accountId,
      userId,
      completedAt: IsNull(),
    });
  }

  private async create(dto: ExtCreateCardDto): Promise<Card> {
    try {
      const account = this.accountsRepository.create({
        userId: dto.userId,
        name: dto.name,
        color: dto.color,
      });
      await this.accountsRepository.save(account);
      const card = this.cardsRepository.create({
        accountId: account.id,
        userId: dto.userId,
      });
      await this.cardsRepository.save(card);
      return card;
    } catch (error) {
      throw new AppException(CardError.CREATE_FAILED);
    }
  }

  private async edit(account: Account, dto: ExtEditCardDto): Promise<void> {
    try {
      account.name = dto.name;
      account.color = dto.color;
      await this.accountsRepository.save(account);
    } catch (error) {
      throw new AppException(CardError.EDIT_FAILED);
    }
  }

  private async addUser(accountId: number, userId: number): Promise<Card> {
    try {
      const card = this.cardsRepository.create({
        accountId,
        userId,
      });
      await this.cardsRepository.save(card);
      return card;
    } catch (error) {
      throw new AppException(CardError.ADD_USER_FAILED);
    }
  }

  private async removeUser(card: Card): Promise<void> {
    try {
      card.completedAt = new Date();
      await this.cardsRepository.save(card);
    } catch (error) {
      throw new AppException(CardError.REMOVE_USER_FAILED);
    }
  }

  private async increaseBalance(account: Account, sum: number): Promise<void> {
    try {
      account.balance += sum;
      await this.accountsRepository.save(account);
    } catch (error) {
      throw new AppException(CardError.INCREASE_BALANCE_FAILED);
    }
  }

  private async decreaseBalance(account: Account, sum: number): Promise<void> {
    try {
      account.balance -= sum;
      await this.accountsRepository.save(account);
    } catch (error) {
      throw new AppException(CardError.DECREASE_BALANCE_FAILED);
    }
  }

  private selectCardsQueryBuilder(userId: number): SelectQueryBuilder<Card> {
    return this.cardsRepository
      .createQueryBuilder('card')
      .innerJoin('card.account', 'account')
      .innerJoin('account.user', 'ownerUser')
      .where('card.completedAt IS NULL')
      .andWhere('card.userId = :userId', { userId })
      .orderBy('account.name', 'ASC')
      .select([
        'card.id',
        'account.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'account.name',
        'account.color',
      ]);
  }

  private getCardsQueryBuilder(req: Request): SelectQueryBuilder<Card> {
    return this.cardsRepository
      .createQueryBuilder('card')
      .innerJoin('card.account', 'account')
      .innerJoin('account.user', 'ownerUser')
      .loadRelationCountAndMap(
        'account.users',
        'account.cards',
        'subCard',
        (qb) => qb.where('subCard.completedAt IS NULL'),
      )
      .where('card.completedAt IS NULL')
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('card.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere('card.userId = :userId', { userId: req.user }),
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
        'account.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'account.name',
        'account.color',
        'account.balance',
        'card.createdAt',
      ]);
  }
}
