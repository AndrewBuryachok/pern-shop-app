import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Payment } from './payment.entity';
import { CardsService } from '../cards/cards.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreatePaymentDto } from './payment.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { PaymentError } from './payment-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private cardsService: CardsService,
    private mqttService: MqttService,
  ) {}

  async getMyPayments(myId: number, req: Request): Promise<Response<Payment>> {
    const [result, count] = await this.getPaymentsQueryBuilder(req)
      .innerJoin('senderAccount.cards', 'senderCards')
      .innerJoin('receiverAccount.cards', 'receiverCards')
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

  async getAllPayments(req: Request): Promise<Response<Payment>> {
    const [result, count] = await this.getPaymentsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createPayment(dto: ExtCreatePaymentDto): Promise<void> {
    await this.createPaymentWithReturn(dto);
  }

  async createPaymentWithReturn(dto: ExtCreatePaymentDto): Promise<number> {
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
    const payment = await this.create(dto);
    this.mqttService.publishNotification(
      payment.id,
      receiverCard.userId,
      senderCard.userId,
      Notification.CREATED_PAYMENT,
    );
    return senderCard.userId;
  }

  async deletePayment(id: number): Promise<void> {
    const payment = await this.paymentsRepository.findOneBy({ id });
    await this.cardsService.decreaseCardBalance({
      ...payment,
      cardId: payment.receiverCardId,
    });
    await this.cardsService.increaseCardBalance({
      ...payment,
      cardId: payment.senderCardId,
    });
    await this.delete(payment);
  }

  async checkPaymentExists(id: number): Promise<void> {
    await this.paymentsRepository.findOneByOrFail({ id });
  }

  private async create(dto: ExtCreatePaymentDto): Promise<Payment> {
    try {
      const payment = this.paymentsRepository.create({
        senderCardId: dto.senderCardId,
        receiverCardId: dto.receiverCardId,
        sum: dto.sum,
        description: dto.description,
      });
      await this.paymentsRepository.save(payment);
      return payment;
    } catch (error) {
      throw new AppException(PaymentError.CREATE_FAILED);
    }
  }

  private async delete(payment: Payment): Promise<void> {
    try {
      await this.paymentsRepository.remove(payment);
    } catch (error) {
      throw new AppException(PaymentError.DELETE_FAILED);
    }
  }

  private getPaymentsQueryBuilder(req: Request): SelectQueryBuilder<Payment> {
    return this.paymentsRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.senderCard', 'senderCard')
      .innerJoin('senderCard.account', 'senderAccount')
      .innerJoin('senderCard.user', 'senderUser')
      .innerJoin('payment.receiverCard', 'receiverCard')
      .innerJoin('receiverCard.account', 'receiverAccount')
      .innerJoin('receiverCard.user', 'receiverUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('payment.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
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
            .orWhere('payment.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minSum}`)
            .orWhere('payment.sum >= :minSum', { minSum: req.minSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxSum}`)
            .orWhere('payment.sum <= :maxSum', { maxSum: req.maxSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('payment.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('payment.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('payment.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'payment.id',
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
        'payment.sum',
        'payment.description',
        'payment.createdAt',
      ]);
  }
}
