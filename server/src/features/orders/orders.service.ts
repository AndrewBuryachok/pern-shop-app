import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Order } from './order.entity';
import { CellsService } from '../cells/cells.service';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import { ExtCreateOrderDto, ExtOrderIdDto, ExtTakeOrderDto } from './order.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { OrderError } from './order-error.enum';
import { TransportationStatus } from '../transportations/transportation-status.enum';
import { Filter, Mode } from '../../common/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private cellsService: CellsService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
  ) {}

  async getMainOrders(req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .andWhere('order.executorCard IS NULL')
      .andWhere('order.createdAt > :date', { date: getDateWeekAgo() })
      .getManyAndCount();
    return { result, count };
  }

  async getMyOrders(myId: number, req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .andWhere('customerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getTakenOrders(myId: number, req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .andWhere('executorUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedOrders(myId: number, req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllOrders(req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createOrder(dto: ExtCreateOrderDto): Promise<void> {
    const cellId = await this.cellsService.reserveCell(dto);
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    await this.create({ ...dto, storageId: cellId });
  }

  async takeOrder(dto: ExtTakeOrderDto): Promise<void> {
    await this.cardsService.checkCardOwner(dto.cardId, dto.myId);
    const order = await this.ordersRepository.findOneBy({
      id: dto.orderId,
    });
    if (order.createdAt < getDateWeekAgo()) {
      throw new AppException(OrderError.ALREADY_EXPIRED);
    }
    if (order.executorCardId) {
      throw new AppException(OrderError.ALREADY_TAKEN);
    }
    await this.take(order, dto.cardId);
  }

  async untakeOrder(dto: ExtOrderIdDto): Promise<void> {
    const order = await this.checkOrderExecutor(dto.orderId, dto.myId);
    if (order.status !== TransportationStatus.TAKEN) {
      throw new AppException(OrderError.NOT_TAKEN);
    }
    await this.untake(order);
  }

  async executeOrder(dto: ExtOrderIdDto): Promise<void> {
    const order = await this.checkOrderExecutor(dto.orderId, dto.myId);
    if (order.status !== TransportationStatus.TAKEN) {
      throw new AppException(OrderError.ALREADY_EXECUTED);
    }
    await this.execute(order);
  }

  async completeOrder(dto: ExtOrderIdDto): Promise<void> {
    const order = await this.checkOrderCustomer(dto.orderId, dto.myId);
    if (order.completedAt) {
      throw new AppException(OrderError.ALREADY_COMPLETED);
    }
    if (order.status !== TransportationStatus.EXECUTED) {
      throw new AppException(OrderError.NOT_EXECUTED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: order.customerCardId,
      sum: order.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      senderCardId: order.customerCardId,
      receiverCardId: order.executorCardId,
      sum: order.price,
      description: 'complete order',
    });
    await this.complete(order);
  }

  async deleteOrder(dto: ExtOrderIdDto): Promise<void> {
    const order = await this.checkOrderCustomer(dto.orderId, dto.myId);
    if (order.executorCardId) {
      throw new AppException(OrderError.ALREADY_TAKEN);
    }
    await this.cardsService.increaseCardBalance({
      cardId: order.customerCardId,
      sum: order.price,
    });
    await this.delete(order);
  }

  async checkOrderExists(id: number): Promise<void> {
    await this.ordersRepository.findOneByOrFail({ id });
  }

  private async checkOrderCustomer(id: number, userId: number): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({
      id,
      customerCard: { userId },
    });
    if (!order) {
      throw new AppException(OrderError.NOT_CUSTOMER);
    }
    return order;
  }

  private async checkOrderExecutor(id: number, userId: number): Promise<Order> {
    const order = await this.ordersRepository.findOneBy({
      id,
      executorCard: { userId },
    });
    if (!order) {
      throw new AppException(OrderError.NOT_EXECUTOR);
    }
    return order;
  }

  private async create(dto: ExtCreateOrderDto): Promise<void> {
    try {
      const order = this.ordersRepository.create({
        cellId: dto.storageId,
        customerCardId: dto.cardId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.CREATE_FAILED);
    }
  }

  private async take(order: Order, cardId: number): Promise<void> {
    try {
      order.executorCardId = cardId;
      order.status = TransportationStatus.TAKEN;
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.TAKE_FAILED);
    }
  }

  private async untake(order: Order): Promise<void> {
    try {
      order.executorCardId = null;
      order.status = TransportationStatus.CREATED;
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.UNTAKE_FAILED);
    }
  }

  private async execute(order: Order): Promise<void> {
    try {
      order.status = TransportationStatus.EXECUTED;
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.EXECUTE_FAILED);
    }
  }

  private async complete(order: Order): Promise<void> {
    try {
      order.completedAt = new Date();
      order.status = TransportationStatus.COMPLETED;
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.COMPLETE_FAILED);
    }
  }

  private async delete(order: Order): Promise<void> {
    try {
      await this.ordersRepository.remove(order);
    } catch (error) {
      throw new AppException(OrderError.DELETE_FAILED);
    }
  }

  private getOrdersQueryBuilder(req: Request): SelectQueryBuilder<Order> {
    return this.ordersRepository
      .createQueryBuilder('order')
      .innerJoin('order.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('order.customerCard', 'customerCard')
      .innerJoin('customerCard.user', 'customerUser')
      .leftJoin('order.executorCard', 'executorCard')
      .leftJoin('executorCard.user', 'executorUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb.where(`${req.mode === Mode.SOME}`).andWhere(
                  new Brackets((qb) =>
                    qb
                      .where(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.CUSTOMER)}`)
                            .andWhere('customerUser.id = :userId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.EXECUTOR)}`)
                            .andWhere('executorUser.id = :userId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.OWNER)}`)
                            .andWhere('ownerUser.id = :userId'),
                        ),
                      ),
                  ),
                ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.EACH}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.CUSTOMER)}`)
                        .orWhere('customerUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.EXECUTOR)}`)
                        .orWhere('executorUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.OWNER)}`)
                        .orWhere('ownerUser.id = :userId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `customerUser.id ${
                      req.filters.includes(Filter.CUSTOMER) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `executorUser.id ${
                      req.filters.includes(Filter.EXECUTOR) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `ownerUser.id ${
                      req.filters.includes(Filter.OWNER) ? '=' : '!='
                    } :userId`,
                  ),
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
                qb.where(`${req.mode === Mode.SOME}`).andWhere(
                  new Brackets((qb) =>
                    qb
                      .where(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.CUSTOMER)}`)
                            .andWhere('customerCard.id = :cardId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.EXECUTOR)}`)
                            .andWhere('executorCard.id = :cardId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.OWNER)}`)
                            .andWhere('ownerCard.id = :cardId'),
                        ),
                      ),
                  ),
                ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.EACH}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.CUSTOMER)}`)
                        .orWhere('customerCard.id = :cardId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.EXECUTOR)}`)
                        .orWhere('executorCard.id = :cardId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.OWNER)}`)
                        .orWhere('ownerCard.id = :cardId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `customerCard.id ${
                      req.filters.includes(Filter.CUSTOMER) ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `executorCard.id ${
                      req.filters.includes(Filter.EXECUTOR) ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `ownerCard.id ${
                      req.filters.includes(Filter.OWNER) ? '=' : '!='
                    } :cardId`,
                  ),
              ),
            ),
        ),
        { cardId: req.card },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.storage}`)
            .orWhere('storage.id = :storageId', { storageId: req.storage }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.cell}`)
            .orWhere('cell.id = :cellId', { cellId: req.cell }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.item}`)
            .orWhere('order.item = :item', { item: req.item }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('order.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .orderBy('order.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'order.id',
        'cell.id',
        'storage.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.name',
        'ownerUser.status',
        'ownerCard.name',
        'ownerCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
        'customerCard.id',
        'customerUser.id',
        'customerUser.name',
        'customerUser.status',
        'customerCard.name',
        'customerCard.color',
        'order.item',
        'order.description',
        'order.amount',
        'order.intake',
        'order.kit',
        'order.price',
        'order.createdAt',
        'executorCard.id',
        'executorUser.id',
        'executorUser.name',
        'executorUser.status',
        'executorCard.name',
        'executorCard.color',
        'order.completedAt',
        'order.status',
      ]);
  }
}
