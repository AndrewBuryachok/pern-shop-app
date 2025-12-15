import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
import { Order } from './order.entity';
import { CardsService } from '../cards/cards.service';
import { TransactionsService } from '../transactions/transactions.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCompleteOrderDto,
  ExtCreateOrderDto,
  ExtEditOrderDto,
  ExtOrderIdDto,
  ExtTakeOrderDto,
} from './order.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { OrderError } from './order-error.enum';
import { Status } from '../transportations/status.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class OrdersService {
  private ordersRepositoryMap: Map<string, Repository<Order>>;

  constructor(
    @InjectRepository(Order, Database.DB1)
    private orders1Repository: Repository<Order>,
    @InjectRepository(Order, Database.DB2)
    private orders2Repository: Repository<Order>,
    private cardsService: CardsService,
    private transactionsService: TransactionsService,
    private mqttService: MqttService,
  ) {
    this.ordersRepositoryMap = new Map(
      [this.orders1Repository, this.orders2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMainOrders(project: string, req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(project, req)
      .andWhere('order.status = :status', {
        status: Status.CREATED,
      })
      .getManyAndCount();
    return { result, count };
  }

  async getMyOrders(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(project, req)
      .innerJoin('customerAccount.cards', 'customerCards')
      .andWhere('customerCards.userId = :myId', { myId })
      .andWhere('customerCards.completedAt IS NULL')
      .getManyAndCount();
    return { result, count };
  }

  async getTakenOrders(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(project, req)
      .leftJoin('executorAccount.cards', 'executorCards')
      .andWhere('executorCards.userId = :myId', { myId })
      .andWhere('executorCards.completedAt IS NULL')
      .getManyAndCount();
    return { result, count };
  }

  async getAllOrders(project: string, req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createOrder(project: string, dto: ExtCreateOrderDto): Promise<void> {
    const card = await this.cardsService.checkCardUser(
      project,
      dto.cardId,
      dto.myId,
      dto.hasRole,
    );
    await this.transactionsService.createDecreaseTransaction(project, {
      cardId: dto.cardId,
      sum: dto.sum,
      description: 'створення замовлення',
      item: dto.item,
    });
    const order = await this.create(project, dto);
    this.mqttService.publishNotification(
      project,
      order.id,
      0,
      card.userId,
      Notification.CREATED_ORDER,
    );
  }

  async editOrder(project: string, dto: ExtEditOrderDto): Promise<void> {
    const order = await this.checkOrderCustomer(
      project,
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.CREATED) {
      throw new AppException(OrderError.ALREADY_TAKEN);
    }
    if (order.sum !== dto.sum) {
      if (order.sum > dto.sum) {
        await this.transactionsService.createIncreaseTransaction(project, {
          cardId: order.customerCardId,
          sum: order.sum - dto.sum,
          description: 'редагування замовлення',
          item: order.item,
        });
      } else {
        await this.transactionsService.createDecreaseTransaction(project, {
          cardId: order.customerCardId,
          sum: dto.sum - order.sum,
          description: 'редагування замовлення',
          item: order.item,
        });
      }
    }
    await this.edit(project, order, dto);
  }

  async takeOrder(project: string, dto: ExtTakeOrderDto): Promise<void> {
    const card = await this.cardsService.checkCardUser(
      project,
      dto.cardId,
      dto.myId,
      dto.hasRole,
    );
    const order = await this.ordersRepositoryMap.get(project).findOne({
      relations: ['customerCard'],
      where: { id: dto.orderId },
    });
    if (order.status !== Status.CREATED) {
      throw new AppException(OrderError.ALREADY_TAKEN);
    }
    await this.take(project, order, dto.cardId);
    this.mqttService.publishNotification(
      project,
      dto.orderId,
      order.customerCard.userId,
      card.userId,
      Notification.TAKEN_ORDER,
    );
  }

  async untakeOrder(project: string, dto: ExtOrderIdDto): Promise<void> {
    const order = await this.checkOrderExecutor(
      project,
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.TAKEN) {
      throw new AppException(OrderError.NOT_TAKEN);
    }
    const userId = order.executorCard.userId;
    await this.untake(project, order);
    this.mqttService.publishNotification(
      project,
      dto.orderId,
      order.customerCard.userId,
      userId,
      Notification.UNTAKEN_ORDER,
    );
  }

  async executeOrder(project: string, dto: ExtOrderIdDto): Promise<void> {
    const order = await this.checkOrderExecutor(
      project,
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.TAKEN) {
      throw new AppException(OrderError.NOT_TAKEN);
    }
    await this.execute(project, order);
    this.mqttService.publishNotification(
      project,
      dto.orderId,
      order.customerCard.userId,
      order.executorCard.userId,
      Notification.EXECUTED_ORDER,
    );
  }

  async completeOrder(
    project: string,
    dto: ExtCompleteOrderDto,
  ): Promise<void> {
    const order = await this.checkOrderCustomer(
      project,
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.EXECUTED) {
      throw new AppException(OrderError.NOT_EXECUTED);
    }
    await this.transactionsService.createIncreaseTransaction(project, {
      cardId: order.customerCardId,
      sum: order.sum,
      description: 'завершення замовлення',
      item: order.item,
    });
    await this.transactionsService.createTransfer(project, {
      myId: dto.myId,
      hasRole: dto.hasRole,
      senderCardId: order.customerCardId,
      receiverCardId: order.executorCardId,
      sum: order.sum,
      description: 'виконання замовлення',
      item: order.item,
    });
    await this.complete(project, order, dto.rate);
    this.unpublishNotification(project, dto.orderId, order.customerCard.userId);
    this.mqttService.publishNotification(
      project,
      dto.orderId,
      order.executorCard.userId,
      order.customerCard.userId,
      Notification.COMPLETED_ORDER,
    );
    if (dto.rate) {
      this.mqttService.publishNotification(
        project,
        dto.orderId,
        order.executorCard.userId,
        order.customerCard.userId,
        Notification.RATED_ORDER,
      );
    }
  }

  async deleteOrder(project: string, dto: ExtOrderIdDto): Promise<void> {
    const order = await this.checkOrderCustomer(
      project,
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.CREATED) {
      throw new AppException(OrderError.ALREADY_TAKEN);
    }
    await this.transactionsService.createIncreaseTransaction(project, {
      cardId: order.customerCardId,
      sum: order.sum,
      description: 'видалення замовлення',
      item: order.item,
    });
    await this.delete(project, order);
    this.unpublishNotification(project, dto.orderId, order.customerCard.userId);
  }

  async checkOrderExists(project: string, id: number): Promise<void> {
    await this.ordersRepositoryMap.get(project).findOneByOrFail({ id });
  }

  private async checkOrderCustomer(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Order> {
    const order = await this.ordersRepositoryMap.get(project).findOne({
      relations: [
        'customerCard',
        'customerCard.account',
        'customerCard.account.cards',
        'executorCard',
      ],
      where: {
        id,
        customerCard: { account: { cards: { completedAt: IsNull() } } },
      },
    });
    const card = order.customerCard.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(OrderError.NOT_CUSTOMER);
    }
    return order;
  }

  private async checkOrderExecutor(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Order> {
    const order = await this.ordersRepositoryMap.get(project).findOne({
      relations: [
        'executorCard',
        'executorCard.account',
        'executorCard.account.cards',
        'customerCard',
      ],
      where: {
        id,
        executorCard: { account: { cards: { completedAt: IsNull() } } },
      },
    });
    const card = order.executorCard.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(OrderError.NOT_EXECUTOR);
    }
    return order;
  }

  private async create(
    project: string,
    dto: ExtCreateOrderDto,
  ): Promise<Order> {
    try {
      const order = this.ordersRepositoryMap.get(project).create({
        stationId: dto.stationId,
        customerCardId: dto.cardId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        sum: dto.sum,
      });
      await this.ordersRepositoryMap.get(project).save(order);
      return order;
    } catch (error) {
      throw new AppException(OrderError.CREATE_FAILED);
    }
  }

  private async edit(
    project: string,
    order: Order,
    dto: ExtEditOrderDto,
  ): Promise<void> {
    try {
      order.item = dto.item;
      order.description = dto.description;
      order.amount = dto.amount;
      order.intake = dto.intake;
      order.kit = dto.kit;
      order.sum = dto.sum;
      await this.ordersRepositoryMap.get(project).save(order);
    } catch (error) {
      throw new AppException(OrderError.EDIT_FAILED);
    }
  }

  private async take(
    project: string,
    order: Order,
    cardId: number,
  ): Promise<void> {
    try {
      order.executorCardId = cardId;
      order.status = Status.TAKEN;
      await this.ordersRepositoryMap.get(project).save(order);
    } catch (error) {
      throw new AppException(OrderError.TAKE_FAILED);
    }
  }

  private async untake(project: string, order: Order): Promise<void> {
    try {
      order.executorCard = null;
      order.executorCardId = null;
      order.status = Status.CREATED;
      await this.ordersRepositoryMap.get(project).save(order);
    } catch (error) {
      throw new AppException(OrderError.UNTAKE_FAILED);
    }
  }

  private async execute(project: string, order: Order): Promise<void> {
    try {
      order.status = Status.EXECUTED;
      await this.ordersRepositoryMap.get(project).save(order);
    } catch (error) {
      throw new AppException(OrderError.EXECUTE_FAILED);
    }
  }

  private async complete(
    project: string,
    order: Order,
    rate: number,
  ): Promise<void> {
    try {
      order.completedAt = new Date();
      order.status = Status.COMPLETED;
      order.rate = rate || null;
      await this.ordersRepositoryMap.get(project).save(order);
    } catch (error) {
      throw new AppException(OrderError.COMPLETE_FAILED);
    }
  }

  private async delete(project: string, order: Order): Promise<void> {
    try {
      await this.ordersRepositoryMap.get(project).remove(order);
    } catch (error) {
      throw new AppException(OrderError.DELETE_FAILED);
    }
  }

  private unpublishNotification(
    project: string,
    id: number,
    userId: number,
  ): void {
    this.mqttService.unpublishNotification(
      project,
      id,
      0,
      userId,
      Notification.CREATED_ORDER,
    );
  }

  private getOrdersQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Order> {
    return this.ordersRepositoryMap
      .get(project)
      .createQueryBuilder('order')
      .innerJoin('order.station', 'station')
      .innerJoin('station.user', 'ownerUser')
      .innerJoin('order.customerCard', 'customerCard')
      .innerJoin('customerCard.account', 'customerAccount')
      .innerJoin('customerCard.user', 'customerUser')
      .leftJoin('order.executorCard', 'executorCard')
      .leftJoin('executorCard.account', 'executorAccount')
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
            ),
        ),
        { cardId: req.card },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.station}`)
            .orWhere('station.id = :stationId', { stationId: req.station }),
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
            .where(`${!req.minSum}`)
            .orWhere('order.sum >= :minSum', { minSum: req.minSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxSum}`)
            .orWhere('order.sum <= :maxSum', { maxSum: req.maxSum }),
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
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('order.completedAt IS NOT NULL'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('order.completedAt IS NULL'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('order.rate = :rate', { rate: req.rate }),
        ),
      )
      .orderBy('order.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'order.id',
        'station.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'station.name',
        'station.x',
        'station.y',
        'customerCard.id',
        'customerAccount.id',
        'customerAccount.name',
        'customerAccount.color',
        'customerUser.id',
        'customerUser.nick',
        'customerUser.avatar',
        'order.item',
        'order.description',
        'order.amount',
        'order.intake',
        'order.kit',
        'order.sum',
        'order.status',
        'executorCard.id',
        'executorAccount.id',
        'executorAccount.name',
        'executorAccount.color',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'order.createdAt',
        'order.completedAt',
        'order.rate',
      ]);
  }
}
