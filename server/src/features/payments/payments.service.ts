import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Payment } from './payment.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
  ) {}

  private getPaymentsQueryBuilder(): SelectQueryBuilder<Payment> {
    return this.paymentsRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.senderCard', 'senderCard')
      .innerJoin('senderCard.user', 'senderUser')
      .innerJoin('payment.receiverCard', 'receiverCard')
      .innerJoin('receiverCard.user', 'receiverUser')
      .orderBy('payment.id', 'DESC')
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
