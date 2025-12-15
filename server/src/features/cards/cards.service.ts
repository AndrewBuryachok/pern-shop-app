import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
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
  private accountsRepositoryMap: Map<string, Repository<Account>>;
  private cardsRepositoryMap: Map<string, Repository<Card>>;

  constructor(
    @InjectRepository(Account, Database.DB1)
    private accounts1Repository: Repository<Account>,
    @InjectRepository(Account, Database.DB2)
    private accounts2Repository: Repository<Account>,
    @InjectRepository(Card, Database.DB1)
    private cards1Repository: Repository<Card>,
    @InjectRepository(Card, Database.DB2)
    private cards2Repository: Repository<Card>,
    private mqttService: MqttService,
  ) {
    this.accountsRepositoryMap = new Map(
      [this.accounts1Repository, this.accounts2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
    this.cardsRepositoryMap = new Map(
      [this.cards1Repository, this.cards2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMyCards(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Card>> {
    const [result, count] = await this.getCardsQueryBuilder(project, req)
      .andWhere('card.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllCards(project: string, req: Request): Promise<Response<Card>> {
    const [result, count] = await this.getCardsQueryBuilder(project, req)
      .andWhere('card.userId = account.userId')
      .getManyAndCount();
    return { result, count };
  }

  selectUserCards(project: string, userId: number): Promise<Card[]> {
    return this.selectCardsQueryBuilder(project, userId).getMany();
  }

  selectUserCardsWithBalance(project: string, userId: number): Promise<Card[]> {
    return this.selectCardsQueryBuilder(project, userId)
      .addSelect('account.balance')
      .getMany();
  }

  async selectCardUsers(project: string, cardId: number): Promise<User[]> {
    const card = await this.cardsRepositoryMap
      .get(project)
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

  async createCard(project: string, dto: ExtCreateCardDto): Promise<void> {
    await this.create(project, dto);
  }

  async editCard(project: string, dto: ExtEditCardDto): Promise<void> {
    const card = await this.checkCardOwner(
      project,
      dto.cardId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(project, card.account, dto);
  }

  async addCardUser(project: string, dto: ExtUpdateCardUserDto): Promise<void> {
    const card = await this.checkCardOwner(
      project,
      dto.cardId,
      dto.myId,
      dto.hasRole,
    );
    if (
      await this.findCardByAccountAndUser(project, card.accountId, dto.userId)
    ) {
      throw new AppException(CardError.ALREADY_IN_CARD);
    }
    const subCard = await this.addUser(project, card.accountId, dto.userId);
    this.mqttService.publishNotification(
      project,
      subCard.id,
      dto.userId,
      card.account.userId,
      Notification.ADDED_CARD,
    );
  }

  async removeCardUser(
    project: string,
    dto: ExtUpdateCardUserDto,
  ): Promise<void> {
    const card = await this.checkCardOwner(
      project,
      dto.cardId,
      dto.myId,
      dto.hasRole,
    );
    if (dto.userId === dto.myId) {
      throw new AppException(CardError.OWNER);
    }
    const subCard = await this.findCardByAccountAndUser(
      project,
      card.accountId,
      dto.userId,
    );
    if (!subCard) {
      throw new AppException(CardError.NOT_IN_CARD);
    }
    await this.removeUser(project, subCard);
    this.mqttService.publishNotification(
      project,
      subCard.id,
      dto.userId,
      card.account.userId,
      Notification.REMOVED_CARD,
    );
  }

  async increaseCardBalance(
    project: string,
    dto: UpdateCardBalanceDto,
  ): Promise<Card> {
    const card = await this.cardsRepositoryMap.get(project).findOne({
      relations: ['account'],
      where: { id: dto.cardId },
    });
    if (card.account.balance + dto.sum > MAX_CARD_BALANCE) {
      throw new AppException(CardError.ALREADY_ENOUGH_BALANCE);
    }
    await this.increaseBalance(project, card.account, dto.sum);
    return card;
  }

  async decreaseCardBalance(
    project: string,
    dto: UpdateCardBalanceDto,
  ): Promise<Card> {
    const card = await this.cardsRepositoryMap.get(project).findOne({
      relations: ['account'],
      where: { id: dto.cardId },
    });
    if (card.account.balance - dto.sum < MIN_CARD_BALANCE) {
      throw new AppException(CardError.NOT_ENOUGH_BALANCE);
    }
    await this.decreaseBalance(project, card.account, dto.sum);
    return card;
  }

  async checkCardExists(project: string, id: number): Promise<void> {
    await this.cardsRepositoryMap.get(project).findOneByOrFail({ id });
  }

  async checkCardOwner(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Card> {
    const card = await this.cardsRepositoryMap.get(project).findOne({
      relations: ['account'],
      where: { id },
    });
    if (card.account.userId !== userId && !hasRole) {
      throw new AppException(CardError.NOT_OWNER);
    }
    return card;
  }

  async checkCardUser(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Card> {
    const card = await this.cardsRepositoryMap.get(project).findOneBy({ id });
    if (card.userId !== userId && !hasRole) {
      throw new AppException(CardError.NOT_USER);
    }
    return card;
  }

  private findCardByAccountAndUser(
    project: string,
    accountId: number,
    userId: number,
  ): Promise<Card> {
    return this.cardsRepositoryMap.get(project).findOneBy({
      accountId,
      userId,
      completedAt: IsNull(),
    });
  }

  private async create(project: string, dto: ExtCreateCardDto): Promise<Card> {
    try {
      const account = this.accountsRepositoryMap.get(project).create({
        userId: dto.userId,
        name: dto.name,
        color: dto.color,
      });
      await this.accountsRepositoryMap.get(project).save(account);
      const card = this.cardsRepositoryMap.get(project).create({
        accountId: account.id,
        userId: dto.userId,
      });
      await this.cardsRepositoryMap.get(project).save(card);
      return card;
    } catch (error) {
      throw new AppException(CardError.CREATE_FAILED);
    }
  }

  private async edit(
    project: string,
    account: Account,
    dto: ExtEditCardDto,
  ): Promise<void> {
    try {
      account.name = dto.name;
      account.color = dto.color;
      await this.accountsRepositoryMap.get(project).save(account);
    } catch (error) {
      throw new AppException(CardError.EDIT_FAILED);
    }
  }

  private async addUser(
    project: string,
    accountId: number,
    userId: number,
  ): Promise<Card> {
    try {
      const card = this.cardsRepositoryMap.get(project).create({
        accountId,
        userId,
      });
      await this.cardsRepositoryMap.get(project).save(card);
      return card;
    } catch (error) {
      throw new AppException(CardError.ADD_USER_FAILED);
    }
  }

  private async removeUser(project: string, card: Card): Promise<void> {
    try {
      card.completedAt = new Date();
      await this.cardsRepositoryMap.get(project).save(card);
    } catch (error) {
      throw new AppException(CardError.REMOVE_USER_FAILED);
    }
  }

  private async increaseBalance(
    project: string,
    account: Account,
    sum: number,
  ): Promise<void> {
    try {
      account.balance += sum;
      await this.accountsRepositoryMap.get(project).save(account);
    } catch (error) {
      throw new AppException(CardError.INCREASE_BALANCE_FAILED);
    }
  }

  private async decreaseBalance(
    project: string,
    account: Account,
    sum: number,
  ): Promise<void> {
    try {
      account.balance -= sum;
      await this.accountsRepositoryMap.get(project).save(account);
    } catch (error) {
      throw new AppException(CardError.DECREASE_BALANCE_FAILED);
    }
  }

  private selectCardsQueryBuilder(
    project: string,
    userId: number,
  ): SelectQueryBuilder<Card> {
    return this.cardsRepositoryMap
      .get(project)
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

  private getCardsQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Card> {
    return this.cardsRepositoryMap
      .get(project)
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
