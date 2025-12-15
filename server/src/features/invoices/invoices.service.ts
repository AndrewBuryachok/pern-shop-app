import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
import { Invoice } from './invoice.entity';
import { CardsService } from '../cards/cards.service';
import { TransactionsService } from '../transactions/transactions.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  DeleteInvoiceDto,
  ExtCompleteInvoiceDto,
  ExtCreateInvoiceDto,
  ExtEditInvoiceDto,
} from './invoice.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { InvoiceError } from './invoice-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class InvoicesService {
  private invoicesRepositoryMap: Map<string, Repository<Invoice>>;

  constructor(
    @InjectRepository(Invoice, Database.DB1)
    private invoices1Repository: Repository<Invoice>,
    @InjectRepository(Invoice, Database.DB2)
    private invoices2Repository: Repository<Invoice>,
    private cardsService: CardsService,
    private transactionsService: TransactionsService,
    private mqttService: MqttService,
  ) {
    this.invoicesRepositoryMap = new Map(
      [this.invoices1Repository, this.invoices2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMyInvoices(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Invoice>> {
    const [result, count] = await this.getInvoicesQueryBuilder(project, req)
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

  async getAllInvoices(
    project: string,
    req: Request,
  ): Promise<Response<Invoice>> {
    const [result, count] = await this.getInvoicesQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createInvoice(
    project: string,
    dto: ExtCreateInvoiceDto,
  ): Promise<void> {
    const card = await this.cardsService.checkCardUser(
      project,
      dto.senderCardId,
      dto.myId,
      dto.hasRole,
    );
    const invoice = await this.create(project, dto);
    this.mqttService.publishNotification(
      project,
      invoice.id,
      dto.receiverUserId,
      card.userId,
      Notification.CREATED_INVOICE,
    );
  }

  async editInvoice(project: string, dto: ExtEditInvoiceDto): Promise<void> {
    const invoice = await this.checkInvoiceSender(
      project,
      dto.invoiceId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(project, invoice, dto);
  }

  async completeInvoice(
    project: string,
    dto: ExtCompleteInvoiceDto,
  ): Promise<void> {
    const invoice = await this.checkInvoiceReceiver(
      project,
      dto.invoiceId,
      dto.myId,
      dto.hasRole,
    );
    await this.transactionsService.createTransfer(project, {
      myId: dto.myId,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: invoice.senderCardId,
      sum: invoice.sum,
      description: invoice.description,
    });
    await this.complete(project, invoice, dto.cardId);
    this.mqttService.publishNotification(
      project,
      dto.invoiceId,
      invoice.senderCard.userId,
      invoice.receiverUserId,
      Notification.COMPLETED_INVOICE,
    );
  }

  async deleteInvoice(project: string, dto: DeleteInvoiceDto): Promise<void> {
    const invoice = await this.checkInvoiceSender(
      project,
      dto.invoiceId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(project, invoice);
    this.mqttService.publishNotification(
      project,
      dto.invoiceId,
      invoice.receiverUserId,
      invoice.senderCard.userId,
      Notification.DELETED_INVOICE,
    );
  }

  async checkInvoiceExists(project: string, id: number): Promise<void> {
    await this.invoicesRepositoryMap.get(project).findOneByOrFail({ id });
  }

  async checkInvoiceSender(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Invoice> {
    const invoice = await this.invoicesRepositoryMap.get(project).findOne({
      relations: ['senderCard'],
      where: { id },
    });
    if (invoice.senderCard.userId !== userId && !hasRole) {
      throw new AppException(InvoiceError.NOT_SENDER);
    }
    this.checkInvoiceNotCompleted(invoice);
    return invoice;
  }

  async checkInvoiceReceiver(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Invoice> {
    const invoice = await this.invoicesRepositoryMap.get(project).findOne({
      relations: ['senderCard'],
      where: { id },
    });
    if (invoice.receiverUserId !== userId && !hasRole) {
      throw new AppException(InvoiceError.NOT_RECEIVER);
    }
    this.checkInvoiceNotCompleted(invoice);
    return invoice;
  }

  checkInvoiceNotCompleted(invoice: Invoice): void {
    if (invoice.completedAt) {
      throw new AppException(InvoiceError.ALREADY_COMPLETED);
    }
  }

  private async create(
    project: string,
    dto: ExtCreateInvoiceDto,
  ): Promise<Invoice> {
    try {
      const invoice = this.invoicesRepositoryMap.get(project).create({
        senderCardId: dto.senderCardId,
        receiverUserId: dto.receiverUserId,
        sum: dto.sum,
        description: dto.description,
      });
      await this.invoicesRepositoryMap.get(project).save(invoice);
      return invoice;
    } catch (error) {
      throw new AppException(InvoiceError.CREATE_FAILED);
    }
  }

  private async edit(
    project: string,
    invoice: Invoice,
    dto: ExtEditInvoiceDto,
  ): Promise<void> {
    try {
      invoice.sum = dto.sum;
      invoice.description = dto.description;
      await this.invoicesRepositoryMap.get(project).save(invoice);
    } catch (error) {
      throw new AppException(InvoiceError.EDIT_FAILED);
    }
  }

  private async complete(
    project: string,
    invoice: Invoice,
    cardId: number,
  ): Promise<void> {
    try {
      invoice.receiverCardId = cardId;
      invoice.completedAt = new Date();
      await this.invoicesRepositoryMap.get(project).save(invoice);
    } catch (error) {
      throw new AppException(InvoiceError.COMPLETE_FAILED);
    }
  }

  private async delete(project: string, invoice: Invoice): Promise<void> {
    try {
      await this.invoicesRepositoryMap.get(project).remove(invoice);
    } catch (error) {
      throw new AppException(InvoiceError.DELETE_FAILED);
    }
  }

  private getInvoicesQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Invoice> {
    return this.invoicesRepositoryMap
      .get(project)
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
