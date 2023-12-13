import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Invoice } from './invoice.entity';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteInvoiceDto,
  ExtCompleteInvoiceDto,
  ExtCreateInvoiceDto,
} from './invoice.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { InvoiceError } from './invoice-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMyInvoices(myId: number, req: Request): Promise<Response<Invoice>> {
    const [result, count] = await this.getInvoicesQueryBuilder(req)
      .innerJoin('senderCard.users', 'senderUsers')
      .andWhere('senderUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedInvoices(
    myId: number,
    req: Request,
  ): Promise<Response<Invoice>> {
    const [result, count] = await this.getInvoicesQueryBuilder(req)
      .leftJoin('receiverCard.users', 'receiverUsers')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('receiverUser.id = :myId')
            .orWhere('receiverUsers.id = :myId'),
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
    await this.cardsService.checkCardUser(
      dto.senderCardId,
      dto.myId,
      dto.hasRole,
    );
    await this.create(dto);
    this.mqttService.publishNotificationMessage(
      dto.receiverUserId,
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
      description: invoice.description,
    });
    await this.complete(invoice, dto.cardId);
    this.mqttService.publishNotificationMessage(
      invoice.senderCard.userId,
      Notification.COMPLETED_INVOICE,
    );
  }

  async deleteInvoice(dto: DeleteInvoiceDto): Promise<void> {
    const invoice = await this.checkInvoiceSender(
      dto.invoiceId,
      dto.myId,
      dto.hasRole,
    );
    if (invoice.completedAt) {
      throw new AppException(InvoiceError.ALREADY_COMPLETED);
    }
    await this.delete(invoice);
  }

  async checkInvoiceExists(id: number): Promise<void> {
    await this.invoicesRepository.findOneByOrFail({ id });
  }

  async checkInvoiceSender(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOne({
      relations: ['senderCard', 'senderCard.users'],
      where: { id },
    });
    if (
      !invoice.senderCard.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(InvoiceError.NOT_SENDER);
    }
    return invoice;
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

  private async create(dto: ExtCreateInvoiceDto): Promise<void> {
    try {
      const invoice = this.invoicesRepository.create({
        senderCardId: dto.senderCardId,
        receiverUserId: dto.receiverUserId,
        sum: dto.sum,
        description: dto.description,
      });
      await this.invoicesRepository.save(invoice);
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
      .innerJoin('senderCard.user', 'senderUser')
      .innerJoin('invoice.receiverUser', 'receiverUser')
      .leftJoin('invoice.receiverCard', 'receiverCard')
      .leftJoin('receiverCard.user', 'user')
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
      .orderBy('invoice.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'invoice.id',
        'senderCard.id',
        'senderUser.id',
        'senderUser.name',
        'senderCard.name',
        'senderCard.color',
        'receiverUser.id',
        'receiverUser.name',
        'receiverCard.id',
        'user.id',
        'user.name',
        'receiverCard.name',
        'receiverCard.color',
        'invoice.sum',
        'invoice.description',
        'invoice.createdAt',
        'invoice.completedAt',
      ]);
  }
}
