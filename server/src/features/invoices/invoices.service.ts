import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Invoice } from './invoice.entity';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCompleteInvoiceDto, ExtCreateInvoiceDto } from './invoice.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { InvoiceError } from './invoice-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMyInvoices(myId: number, req: Request): Promise<Response<Invoice>> {
    const [result, count] = await this.getInvoicesQueryBuilder(req)
      .innerJoin('senderAccount.cards', 'senderCards')
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
            .orWhere('user.id = :myId')
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

  async getAllInvoices(req: Request): Promise<Response<Invoice>> {
    const [result, count] = await this.getInvoicesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createInvoice(dto: ExtCreateInvoiceDto): Promise<void> {
    const invoice = await this.create(dto);
    this.mqttService.publishNotification(
      invoice.id,
      dto.receiverUserId,
      dto.myId,
      Notification.CREATED_INVOICE,
    );
  }

  async completeInvoice(dto: ExtCompleteInvoiceDto): Promise<void> {
    const invoice = await this.checkInvoiceReceiver(
      dto.invoiceId,
      dto.myId,
      dto.hasRole,
    );
    if (invoice.completedAt) {
      throw new AppException(InvoiceError.ALREADY_COMPLETED);
    }
    await this.paymentsService.createPayment({
      myId: dto.myId,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: invoice.senderCardId,
      sum: invoice.sum,
      description: `оплата інвойсу ${invoice.id}`,
    });
    await this.complete(invoice, dto.cardId);
    this.mqttService.publishNotification(
      dto.invoiceId,
      invoice.senderCard.userId,
      invoice.receiverUserId,
      Notification.COMPLETED_INVOICE,
    );
  }

  async deleteInvoice(id: number): Promise<void> {
    const invoice = await this.invoicesRepository.findOne({
      relations: ['senderCard'],
      where: { id },
    });
    if (invoice.completedAt) {
      throw new AppException(InvoiceError.ALREADY_COMPLETED);
    }
    await this.delete(invoice);
    this.mqttService.publishNotification(
      id,
      invoice.receiverUserId,
      invoice.senderCard.userId,
      Notification.DELETED_INVOICE,
    );
  }

  async checkInvoiceExists(id: number): Promise<void> {
    await this.invoicesRepository.findOneByOrFail({ id });
  }

  async checkInvoiceReceiver(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      relations: ['senderCard'],
      where: { id },
    });
    if (invoice.receiverUserId !== userId && !hasRole) {
      throw new AppException(InvoiceError.NOT_RECEIVER);
    }
    return invoice;
  }

  private async create(dto: ExtCreateInvoiceDto): Promise<Invoice> {
    try {
      const invoice = this.invoicesRepository.create({
        senderCardId: dto.senderCardId,
        receiverUserId: dto.receiverUserId,
        sum: dto.sum,
        description: dto.description,
      });
      await this.invoicesRepository.save(invoice);
      return invoice;
    } catch (error) {
      throw new AppException(InvoiceError.CREATE_FAILED);
    }
  }

  private async complete(invoice: Invoice, cardId: number): Promise<void> {
    try {
      invoice.receiverCardId = cardId;
      invoice.completedAt = new Date();
      await this.invoicesRepository.save(invoice);
    } catch (error) {
      throw new AppException(InvoiceError.COMPLETE_FAILED);
    }
  }

  private async delete(invoice: Invoice): Promise<void> {
    try {
      await this.invoicesRepository.remove(invoice);
    } catch (error) {
      throw new AppException(InvoiceError.DELETE_FAILED);
    }
  }

  private getInvoicesQueryBuilder(req: Request): SelectQueryBuilder<Invoice> {
    return this.invoicesRepository
      .createQueryBuilder('invoice')
      .innerJoin('invoice.senderCard', 'senderCard')
      .innerJoin('senderCard.account', 'senderAccount')
      .innerJoin('senderCard.user', 'senderUser')
      .innerJoin('invoice.receiverUser', 'user')
      .leftJoin('invoice.receiverCard', 'receiverCard')
      .leftJoin('receiverCard.account', 'receiverAccount')
      .leftJoin('receiverCard.user', 'receiverUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('invoice.id = :id', { id: req.id }),
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
                  .andWhere('user.id = :userId'),
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
            .orWhere('invoice.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minSum}`)
            .orWhere('invoice.sum >= :minSum', { minSum: req.minSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxSum}`)
            .orWhere('invoice.sum <= :maxSum', { maxSum: req.maxSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('invoice.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('invoice.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('invoice.completedAt IS NOT NULL'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('invoice.completedAt IS NULL'),
        ),
      )
      .orderBy('invoice.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'invoice.id',
        'senderCard.id',
        'senderAccount.id',
        'senderAccount.name',
        'senderAccount.color',
        'senderUser.id',
        'senderUser.nick',
        'senderUser.avatar',
        'user.id',
        'user.nick',
        'user.avatar',
        'receiverCard.id',
        'receiverAccount.id',
        'receiverAccount.name',
        'receiverAccount.color',
        'receiverUser.id',
        'receiverUser.nick',
        'receiverUser.avatar',
        'invoice.sum',
        'invoice.description',
        'invoice.createdAt',
        'invoice.completedAt',
      ]);
  }
}
