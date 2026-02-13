import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
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
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private cardsService: CardsService,
    private mqttService: MqttService,
  ) {}

  async getMyTransactions(
    myId: number,
    req: Request,
  ): Promise<Response<Transaction>> {
    const [result, count] = await this.getTransactionsQueryBuilder(req)
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

  async getAllTransactions(req: Request): Promise<Response<Transaction>> {
    const [result, count] = await this.getTransactionsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createDeposit(myId: number, dto: CreateTransactionDto): Promise<void> {
    await this.createIncreaseTransaction(
      { ...dto, description: 'внесення діамантів' },
      myId,
    );
  }

  async createWithdraw(myId: number, dto: CreateTransactionDto): Promise<void> {
    await this.createDecreaseTransaction(
      { ...dto, description: 'зняття діамантів' },
      myId,
    );
  }

  async createIncreaseTransaction(
    dto: CreateTransactionWithDescriptionDto,
    myId?: number,
  ): Promise<void> {
    const card = await this.cardsService.increaseCardBalance(dto);
    const userId = myId || card.userId;
    const transaction = await this.createIncrease(userId, dto);
    this.publishCreateTransactionNotification(
      transaction.id,
      card.userId,
      userId,
    );
  }

  async createDecreaseTransaction(
    dto: CreateTransactionWithDescriptionDto,
    myId?: number,
  ): Promise<void> {
    const card = await this.cardsService.decreaseCardBalance(dto);
    const userId = myId || card.userId;
    const transaction = await this.createDecrease(userId, dto);
    this.publishCreateTransactionNotification(
      transaction.id,
      card.userId,
      userId,
    );
  }

  publishCreateTransactionNotification(
    id: number,
    toUserId: number,
    fromUserId: number,
  ): void {
    this.mqttService.publishNotification(
      id,
      toUserId,
      fromUserId,
      Notification.CREATED_TRANSACTION,
    );
  }

  async createTransfer(dto: ExtCreateTransferDto): Promise<void> {
    await this.createTransferWithReturn(dto);
  }

  async createTransferWithReturn(dto: ExtCreateTransferDto): Promise<number> {
    await this.cardsService.checkCardUser(
      dto.senderCardId,
      dto.myId,
      dto.hasRole,
    );
    const senderCard = await this.cardsService.decreaseCardBalance({
      ...dto,
      cardId: dto.senderCardId,
    });
    const receiverCard = await this.cardsService.increaseCardBalance({
      ...dto,
      cardId: dto.receiverCardId,
    });
    const transfer = await this.transfer(dto);
    this.mqttService.publishNotification(
      transfer.id,
      receiverCard.userId,
      senderCard.userId,
      Notification.TRANSFERRED_TRANSACTION,
    );
    return senderCard.userId;
  }

  async deleteTransaction(id: number): Promise<void> {
    const transaction = await this.transactionsRepository.findOneBy({ id });
    if (transaction.receiverCardId) {
      await this.cardsService.decreaseCardBalance({
        ...transaction,
        cardId: transaction.receiverCardId,
      });
    }
    if (transaction.senderCardId) {
      await this.cardsService.increaseCardBalance({
        ...transaction,
        cardId: transaction.senderCardId,
      });
    }
    await this.delete(transaction);
  }

  async checkTransactionExists(id: number): Promise<void> {
    await this.transactionsRepository.findOneByOrFail({ id });
  }

  private async createIncrease(
    executorUserId: number,
    dto: CreateTransactionWithDescriptionDto,
  ): Promise<Transaction> {
    try {
      const transaction = this.transactionsRepository.create({
        executorUserId,
        receiverCardId: dto.cardId,
        sum: dto.sum,
        description: dto.description,
        item: dto.item,
      });
      await this.transactionsRepository.save(transaction);
      return transaction;
    } catch (error) {
      throw new AppException(TransactionError.INCREASE_FAILED);
    }
  }

  private async createDecrease(
    executorUserId: number,
    dto: CreateTransactionWithDescriptionDto,
  ): Promise<Transaction> {
    try {
      const transaction = this.transactionsRepository.create({
        executorUserId,
        senderCardId: dto.cardId,
        sum: dto.sum,
        description: dto.description,
        item: dto.item,
      });
      await this.transactionsRepository.save(transaction);
      return transaction;
    } catch (error) {
      throw new AppException(TransactionError.DECREASE_FAILED);
    }
  }

  private async transfer(dto: ExtCreateTransferDto): Promise<Transaction> {
    try {
      const transfer = this.transactionsRepository.create({
        senderCardId: dto.senderCardId,
        receiverCardId: dto.receiverCardId,
        sum: dto.sum,
        description: dto.description,
        item: dto.item,
      });
      await this.transactionsRepository.save(transfer);
      return transfer;
    } catch (error) {
      throw new AppException(TransactionError.TRANSFER_FAILED);
    }
  }

  private async delete(transaction: Transaction): Promise<void> {
    try {
      await this.transactionsRepository.remove(transaction);
    } catch (error) {
      throw new AppException(TransactionError.DELETE_FAILED);
    }
  }

  private getTransactionsQueryBuilder(
    req: Request,
  ): SelectQueryBuilder<Transaction> {
    return this.transactionsRepository
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
