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
      .innerJoin('senderCard.users', 'senderUsers')
      .innerJoin('receiverCard.users', 'receiverUsers')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('senderUsers.id = :myId')
            .orWhere('receiverUsers.id = :myId'),
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
    await this.cardsService.checkCardUser(
      dto.senderCardId,
      dto.myId,
      dto.hasRole,
    );
    await this.cardsService.decreaseCardBalance({
      ...dto,
      cardId: dto.senderCardId,
    });
    const card = await this.cardsService.increaseCardBalance({
      ...dto,
      cardId: dto.receiverCardId,
    });
    await this.create(dto);
    this.mqttService.publishNotificationMessage(
      card.userId,
      Notification.CREATED_PAYMENT,
    );
  }

  private async create(dto: ExtCreatePaymentDto): Promise<void> {
    try {
      const payment = this.paymentsRepository.create({
        senderCardId: dto.senderCardId,
        receiverCardId: dto.receiverCardId,
        sum: dto.sum,
        description: dto.description,
      });
      await this.paymentsRepository.save(payment);
    } catch (error) {
      throw new AppException(PaymentError.CREATE_FAILED);
    }
  }

  private getPaymentsQueryBuilder(req: Request): SelectQueryBuilder<Payment> {
    return this.paymentsRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.senderCard', 'senderCard')
      .innerJoin('senderCard.user', 'senderUser')
      .innerJoin('payment.receiverCard', 'receiverCard')
      .innerJoin('receiverCard.user', 'receiverUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.SENDER}`)
                  .andWhere('senderUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.RECEIVER}`)
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
                  .where(`${!req.mode || req.mode == Mode.SENDER}`)
                  .andWhere('senderCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.RECEIVER}`)
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
      .orderBy('payment.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'payment.id',
        'senderCard.id',
        'senderUser.id',
        'senderUser.name',
        'senderCard.name',
        'senderCard.color',
        'receiverCard.id',
        'receiverUser.id',
        'receiverUser.name',
        'receiverCard.name',
        'receiverCard.color',
        'payment.sum',
        'payment.description',
        'payment.createdAt',
      ]);
  }
}
