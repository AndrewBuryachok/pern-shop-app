import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Invoice } from './invoice.entity';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import {
  DeleteInvoiceDto,
  ExtCompleteInvoiceDto,
  ExtCreateInvoiceDto,
} from './invoice.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { InvoiceError } from './invoice-error.enum';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
  ) {}

  async getMyInvoices(myId: number, req: Request): Promise<Response<Invoice>> {
    const [result, count] = await this.getInvoicesQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb.where('senderUser.id = :myId').orWhere('recipientUser.id = :myId'),
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
    await this.cardsService.checkCardOwner(dto.senderCardId, dto.myId);
    await this.create(dto);
  }

  async completeInvoice(dto: ExtCompleteInvoiceDto): Promise<void> {
    const invoice = await this.checkInvoiceReceiver(dto.invoiceId, dto.myId);
    if (invoice.completedAt) {
      throw new AppException(InvoiceError.ALREADY_COMPLETED);
    }
    await this.paymentsService.createPayment({
      myId: dto.myId,
      senderCardId: dto.cardId,
      receiverCardId: invoice.senderCardId,
      sum: invoice.sum,
      description: invoice.description,
    });
    await this.complete(invoice, dto.cardId);
  }

  async deleteInvoice(dto: DeleteInvoiceDto): Promise<void> {
    const invoice = await this.checkInvoiceSender(dto.invoiceId, dto.myId);
    if (invoice.completedAt) {
      throw new AppException(InvoiceError.ALREADY_COMPLETED);
    }
    await this.delete(invoice);
  }

  async checkInvoiceExists(id: number): Promise<void> {
    await this.invoicesRepository.findOneByOrFail({ id });
  }

  async checkInvoiceSender(id: number, userId: number): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOneBy({
      id,
      senderCard: { userId },
    });
    if (!invoice) {
      throw new AppException(InvoiceError.NOT_SENDER);
    }
    return invoice;
  }

  async checkInvoiceReceiver(id: number, userId: number): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOneBy({
      id,
      receiverUserId: userId,
    });
    if (!invoice) {
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
      .innerJoin('invoice.receiverUser', 'recipientUser')
      .leftJoin('invoice.receiverCard', 'receiverCard')
      .leftJoin('receiverCard.user', 'receiverUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode}`)
                  .andWhere(
                    `senderUser.id ${
                      req.filters.includes('sender') ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `recipientUser.id ${
                      req.filters.includes('receiver') ? '=' : '!='
                    } :userId`,
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes('sender')}`)
                              .andWhere('senderUser.id = :userId'),
                          ),
                        )
                        .orWhere(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes('receiver')}`)
                              .andWhere('recipientUser.id = :userId'),
                          ),
                        ),
                    ),
                  ),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere('invoice.description ILIKE :description', {
        description: `%${req.description}%`,
      })
      .orderBy('invoice.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'invoice.id',
        'senderCard.id',
        'senderUser.id',
        'senderUser.name',
        'senderUser.status',
        'senderCard.name',
        'senderCard.color',
        'recipientUser.id',
        'recipientUser.name',
        'recipientUser.status',
        'receiverCard.id',
        'receiverUser.id',
        'receiverUser.name',
        'receiverUser.status',
        'receiverCard.name',
        'receiverCard.color',
        'invoice.sum',
        'invoice.description',
        'invoice.createdAt',
        'invoice.completedAt',
      ]);
  }
}
