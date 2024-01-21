import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Order } from './order.entity';
import { LeasesService } from '../leases/leases.service';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateOrderDto,
  ExtOrderIdDto,
  ExtRateOrderDto,
  ExtTakeOrderDto,
} from './order.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { OrderError } from './order-error.enum';
import { Status } from '../transportations/status.enum';
import { Kind } from '../leases/kind.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private leasesService: LeasesService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainOrders(req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .andWhere('order.status = :status', {
        status: Status.CREATED,
      })
      .andWhere('lease.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyOrders(myId: number, req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .innerJoin('customerCard.users', 'customerUsers')
      .andWhere('customerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getTakenOrders(myId: number, req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .leftJoin('executorCard.users', 'executorUsers')
      .andWhere('executorUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedOrders(myId: number, req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
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
    const leaseId = await this.leasesService.createLease({
      ...dto,
      kind: Kind.ORDER,
    });
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    await this.create({ ...dto, storageId: leaseId });
    this.mqttService.publishNotificationMessage(0, Notification.CREATED_ORDER);
  }

  async takeOrder(dto: ExtTakeOrderDto): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    const order = await this.ordersRepository.findOne({
      relations: ['lease', 'lease.card'],
      where: { id: dto.orderId },
    });
    if (order.status !== Status.CREATED) {
      throw new AppException(OrderError.NOT_CREATED);
    }
    if (order.lease.completedAt < new Date()) {
      throw new AppException(OrderError.ALREADY_EXPIRED);
    }
    await this.take(order, dto.cardId);
    this.mqttService.publishNotificationMessage(
      order.lease.card.userId,
      Notification.TAKEN_ORDER,
    );
  }

  async untakeOrder(dto: ExtOrderIdDto): Promise<void> {
    const order = await this.checkOrderExecutor(
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.TAKEN) {
      throw new AppException(OrderError.NOT_TAKEN);
    }
    await this.untake(order);
    this.mqttService.publishNotificationMessage(
      order.lease.card.userId,
      Notification.UNTAKEN_ORDER,
    );
  }

  async executeOrder(dto: ExtOrderIdDto): Promise<void> {
    const order = await this.checkOrderExecutor(
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.TAKEN) {
      throw new AppException(OrderError.NOT_TAKEN);
    }
    await this.execute(order);
    this.mqttService.publishNotificationMessage(
      order.lease.card.userId,
      Notification.EXECUTED_ORDER,
    );
  }

  async completeOrder(dto: ExtOrderIdDto): Promise<void> {
    const order = await this.checkOrderCustomer(
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.EXECUTED) {
      throw new AppException(OrderError.NOT_EXECUTED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: order.lease.cardId,
      sum: order.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      hasRole: dto.hasRole,
      senderCardId: order.lease.cardId,
      receiverCardId: order.executorCardId,
      sum: order.price,
      description: '',
    });
    await this.complete(order);
    this.mqttService.publishNotificationMessage(
      order.executorCard.userId,
      Notification.COMPLETED_ORDER,
    );
  }

  async deleteOrder(dto: ExtOrderIdDto): Promise<void> {
    const order = await this.checkOrderCustomer(
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.CREATED) {
      throw new AppException(OrderError.NOT_CREATED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: order.lease.cardId,
      sum: order.price,
    });
    await this.delete(order);
  }

  async rateOrder(dto: ExtRateOrderDto): Promise<void> {
    const order = await this.checkOrderCustomer(
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.COMPLETED) {
      throw new AppException(OrderError.NOT_COMPLETED);
    }
    await this.rate(order, dto.rate);
    this.mqttService.publishNotificationMessage(
      order.executorCard.userId,
      Notification.RATED_ORDER,
    );
  }

  async checkOrderExists(id: number): Promise<void> {
    await this.ordersRepository.findOneByOrFail({ id });
  }

  private async checkOrderCustomer(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      relations: ['lease', 'lease.card', 'lease.card.users', 'executorCard'],
      where: { id },
    });
    if (
      !order.lease.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(OrderError.NOT_CUSTOMER);
    }
    return order;
  }

  private async checkOrderExecutor(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      relations: ['executorCard', 'executorCard.users', 'lease', 'lease.card'],
      where: { id },
    });
    if (
      !order.executorCard.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(OrderError.NOT_EXECUTOR);
    }
    return order;
  }

  private async create(dto: ExtCreateOrderDto): Promise<void> {
    try {
      const order = this.ordersRepository.create({
        leaseId: dto.storageId,
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
      order.status = Status.TAKEN;
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.TAKE_FAILED);
    }
  }

  private async untake(order: Order): Promise<void> {
    try {
      order.executorCard = null;
      order.executorCardId = null;
      order.status = Status.CREATED;
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.UNTAKE_FAILED);
    }
  }

  private async execute(order: Order): Promise<void> {
    try {
      order.status = Status.EXECUTED;
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.EXECUTE_FAILED);
    }
  }

  private async complete(order: Order): Promise<void> {
    try {
      order.completedAt = new Date();
      order.status = Status.COMPLETED;
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.COMPLETE_FAILED);
    }
  }

  private async delete(order: Order): Promise<void> {
    try {
      order.completedAt = new Date();
      order.status = Status.COMPLETED;
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.DELETE_FAILED);
    }
  }

  private async rate(order: Order, rate: number): Promise<void> {
    try {
      order.rate = rate || null;
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.RATE_FAILED);
    }
  }

  private getOrdersQueryBuilder(req: Request): SelectQueryBuilder<Order> {
    return this.ordersRepository
      .createQueryBuilder('order')
      .innerJoin('order.lease', 'lease')
      .innerJoin('lease.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('lease.card', 'customerCard')
      .innerJoin('customerCard.user', 'customerUser')
      .leftJoin('order.executorCard', 'executorCard')
      .leftJoin('executorCard.user', 'executorUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('order.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.CUSTOMER}`)
                  .andWhere('customerUser.id = :userId'),
              ),
            )
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
                  .where(`${!req.mode || req.mode === Mode.OWNER}`)
                  .andWhere('ownerUser.id = :userId'),
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
                  .where(`${!req.mode || req.mode === Mode.CUSTOMER}`)
                  .andWhere('customerCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.EXECUTOR}`)
                  .andWhere('executorCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.OWNER}`)
                  .andWhere('ownerCard.id = :cardId'),
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
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.minAmount}`).orWhere('order.amount >= :minAmount', {
            minAmount: req.minAmount,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxAmount}`).orWhere('order.amount <= :maxAmount', {
            maxAmount: req.maxAmount,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.minIntake}`).orWhere('order.intake >= :minIntake', {
            minIntake: req.minIntake,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxIntake}`).orWhere('order.intake <= :maxIntake', {
            maxIntake: req.maxIntake,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.kit}`).orWhere('order.kit = :kit', { kit: req.kit }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('order.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('order.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.status}`)
            .orWhere('order.status = :status', { status: req.status }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('order.rate = :rate', { rate: req.rate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('order.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('order.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('order.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'order.id',
        'lease.id',
        'cell.id',
        'storage.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'ownerCard.name',
        'ownerCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
        'customerCard.id',
        'customerUser.id',
        'customerUser.nick',
        'customerUser.avatar',
        'customerCard.name',
        'customerCard.color',
        'order.item',
        'order.description',
        'order.amount',
        'order.intake',
        'order.kit',
        'order.price',
        'order.status',
        'order.createdAt',
        'executorCard.id',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'executorCard.name',
        'executorCard.color',
        'order.completedAt',
        'order.rate',
      ]);
  }
}
