import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
import { Transaction } from './transaction.entity';
import { CardsService } from '../cards/cards.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  CreateTransactionDto,
  CreateTransactionWithDescriptionDto,
  ExtCreateTransferDto,
} from './transaction.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { TransactionError } from './transaction-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class TransactionsService {
  private transactionsRepositoryMap: Map<string, Repository<Transaction>>;

  constructor(
    @InjectRepository(Transaction, Database.DB1)
    private transactions1Repository: Repository<Transaction>,
    @InjectRepository(Transaction, Database.DB2)
    private transactions2Repository: Repository<Transaction>,
    private cardsService: CardsService,
    private mqttService: MqttService,
  ) {
    this.transactionsRepositoryMap = new Map(
      [this.transactions1Repository, this.transactions2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMyTransactions(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Transaction>> {
    const [result, count] = await this.getTransactionsQueryBuilder(project, req)
      .leftJoin('senderAccount.cards', 'senderCards')
      .leftJoin('receiverAccount.cards', 'receiverCards')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(
              new Brackets((qb) =>
                qb
                  .where('senderCards.userId = :myId')
                  .andWhere('senderCards.completedAt IS NULL'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where('receiverCards.userId = :myId')
                  .andWhere('receiverCards.completedAt IS NULL'),
              ),
            ),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllTransactions(
    project: string,
    req: Request,
  ): Promise<Response<Transaction>> {
    const [result, count] = await this.getTransactionsQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createDeposit(
    project: string,
    myId: number,
    dto: CreateTransactionDto,
  ): Promise<void> {
    await this.createIncreaseTransaction(
      project,
      { ...dto, description: 'внесення діамантів' },
      myId,
    );
  }

  async createWithdraw(
    project: string,
    myId: number,
    dto: CreateTransactionDto,
  ): Promise<void> {
    await this.createDecreaseTransaction(
      project,
      { ...dto, description: 'зняття діамантів' },
      myId,
    );
  }

  async createIncreaseTransaction(
    project: string,
    dto: CreateTransactionWithDescriptionDto,
    myId?: number,
  ): Promise<void> {
    const card = await this.cardsService.increaseCardBalance(project, dto);
    const userId = myId || card.userId;
    const transaction = await this.createIncrease(project, userId, dto);
    this.publishCreateTransactionNotification(
      project,
      transaction.id,
      card.userId,
      userId,
    );
  }

  async createDecreaseTransaction(
    project: string,
    dto: CreateTransactionWithDescriptionDto,
    myId?: number,
  ): Promise<void> {
    const card = await this.cardsService.decreaseCardBalance(project, dto);
    const userId = myId || card.userId;
    const transaction = await this.createDecrease(project, userId, dto);
    this.publishCreateTransactionNotification(
      project,
      transaction.id,
      card.userId,
      userId,
    );
  }

  publishCreateTransactionNotification(
    project: string,
    id: number,
    toUserId: number,
    fromUserId: number,
  ): void {
    this.mqttService.publishNotification(
      project,
      id,
      toUserId,
      fromUserId,
      Notification.CREATED_TRANSACTION,
    );
  }

  async createTransfer(
    project: string,
    dto: ExtCreateTransferDto,
  ): Promise<void> {
    await this.createTransferWithReturn(project, dto);
  }

  async createTransferWithReturn(
    project: string,
    dto: ExtCreateTransferDto,
  ): Promise<number> {
    await this.cardsService.checkCardUser(
      project,
      dto.senderCardId,
      dto.myId,
      dto.hasRole,
    );
    const senderCard = await this.cardsService.decreaseCardBalance(project, {
      ...dto,
      cardId: dto.senderCardId,
    });
    const receiverCard = await this.cardsService.increaseCardBalance(project, {
      ...dto,
      cardId: dto.receiverCardId,
    });
    const transfer = await this.transfer(project, dto);
    this.mqttService.publishNotification(
      project,
      transfer.id,
      receiverCard.userId,
      senderCard.userId,
      Notification.TRANSFERRED_TRANSACTION,
    );
    return senderCard.userId;
  }

  async deleteTransaction(project: string, id: number): Promise<void> {
    const transaction = await this.transactionsRepositoryMap
      .get(project)
      .findOneBy({ id });
    if (transaction.receiverCardId) {
      await this.cardsService.decreaseCardBalance(project, {
        ...transaction,
        cardId: transaction.receiverCardId,
      });
    }
    if (transaction.senderCardId) {
      await this.cardsService.increaseCardBalance(project, {
        ...transaction,
        cardId: transaction.senderCardId,
      });
    }
    await this.delete(project, transaction);
  }

  async checkTransactionExists(project: string, id: number): Promise<void> {
    await this.transactionsRepositoryMap.get(project).findOneByOrFail({ id });
  }

  private async createIncrease(
    project: string,
    executorUserId: number,
    dto: CreateTransactionWithDescriptionDto,
  ): Promise<Transaction> {
    try {
      const transaction = this.transactionsRepositoryMap.get(project).create({
        executorUserId,
        receiverCardId: dto.cardId,
        sum: dto.sum,
        description: dto.description,
        item: dto.item,
      });
      await this.transactionsRepositoryMap.get(project).save(transaction);
      return transaction;
    } catch (error) {
      throw new AppException(TransactionError.INCREASE_FAILED);
    }
  }

  private async createDecrease(
    project: string,
    executorUserId: number,
    dto: CreateTransactionWithDescriptionDto,
  ): Promise<Transaction> {
    try {
      const transaction = this.transactionsRepositoryMap.get(project).create({
        executorUserId,
        senderCardId: dto.cardId,
        sum: dto.sum,
        description: dto.description,
        item: dto.item,
      });
      await this.transactionsRepositoryMap.get(project).save(transaction);
      return transaction;
    } catch (error) {
      throw new AppException(TransactionError.DECREASE_FAILED);
    }
  }

  private async transfer(
    project: string,
    dto: ExtCreateTransferDto,
  ): Promise<Transaction> {
    try {
      const transfer = this.transactionsRepositoryMap.get(project).create({
        senderCardId: dto.senderCardId,
        receiverCardId: dto.receiverCardId,
        sum: dto.sum,
        description: dto.description,
        item: dto.item,
      });
      await this.transactionsRepositoryMap.get(project).save(transfer);
      return transfer;
    } catch (error) {
      throw new AppException(TransactionError.TRANSFER_FAILED);
    }
  }

  private async delete(
    project: string,
    transaction: Transaction,
  ): Promise<void> {
    try {
      await this.transactionsRepositoryMap.get(project).remove(transaction);
    } catch (error) {
      throw new AppException(TransactionError.DELETE_FAILED);
    }
  }

  private getTransactionsQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Transaction> {
    return this.transactionsRepositoryMap
      .get(project)
      .createQueryBuilder('transaction')
      .leftJoin('transaction.executorUser', 'executorUser')
      .leftJoin('transaction.senderCard', 'senderCard')
      .leftJoin('senderCard.account', 'senderAccount')
      .leftJoin('senderCard.user', 'senderUser')
      .leftJoin('transaction.receiverCard', 'receiverCard')
      .leftJoin('receiverCard.account', 'receiverAccount')
      .leftJoin('receiverCard.user', 'receiverUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.id}`)
            .orWhere('transaction.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.EXECUTOR}`)
                  .andWhere('executorUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.SENDER}`)
                  .andWhere('senderUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.RECEIVER}`)
                  .andWhere('receiverUser.id = :userId'),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.card}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.SENDER}`)
                  .andWhere('senderCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.RECEIVER}`)
                  .andWhere('receiverCard.id = :cardId'),
              ),
            ),
        ),
        { cardId: req.card },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('transaction.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minSum}`)
            .orWhere('transaction.sum >= :minSum', { minSum: req.minSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxSum}`)
            .orWhere('transaction.sum <= :maxSum', { maxSum: req.maxSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('transaction.createdAt >= :minDate', {
              minDate: req.minDate,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('transaction.createdAt <= :maxDate', {
              maxDate: req.maxDate,
            }),
        ),
      )
      .orderBy('transaction.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'transaction.id',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'senderCard.id',
        'senderAccount.id',
        'senderAccount.name',
        'senderAccount.color',
        'senderUser.id',
        'senderUser.nick',
        'senderUser.avatar',
        'receiverCard.id',
        'receiverAccount.id',
        'receiverAccount.name',
        'receiverAccount.color',
        'receiverUser.id',
        'receiverUser.nick',
        'receiverUser.avatar',
        'transaction.sum',
        'transaction.description',
        'transaction.item',
        'transaction.createdAt',
      ]);
  }
}
