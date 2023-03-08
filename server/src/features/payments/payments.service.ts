import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Payment } from './payment.entity';
import { CardsService } from '../cards/cards.service';
import { ExtCreatePaymentDto } from './payment.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { PaymentError } from './payment-error.enum';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    private cardsService: CardsService,
  ) {}

  async getMyPayments(myId: number, req: Request): Promise<Response<Payment>> {
    const [result, count] = await this.getPaymentsQueryBuilder(req)
      .andWhere('(senderUser.id = :myId OR receiverUser.id = :myId)', { myId })
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
    await this.cardsService.checkCardOwner(dto.senderCardId, dto.myId);
    await this.cardsService.decreaseCardBalance({
      ...dto,
      cardId: dto.senderCardId,
    });
    await this.cardsService.increaseCardBalance({
      ...dto,
      cardId: dto.receiverCardId,
    });
    await this.create(dto);
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
        '(senderUser.name ILIKE :search OR receiverUser.name ILIKE :search)',
        { search: `%${req.search || ''}%` },
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
