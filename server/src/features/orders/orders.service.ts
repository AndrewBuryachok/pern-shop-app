import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Order } from './order.entity';
import { HiresService } from '../hires/hires.service';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
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
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    private hiresService: HiresService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainOrders(req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .andWhere('order.status = :status', {
        status: Status.CREATED,
      })
      .andWhere('hire.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyOrders(myId: number, req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .innerJoin('customerAccount.cards', 'customerCards')
      .andWhere('customerCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getTakenOrders(myId: number, req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .leftJoin('executorAccount.cards', 'executorCards')
      .andWhere('executorCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedOrders(myId: number, req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllOrders(req: Request): Promise<Response<Order>> {
    const [result, count] = await this.getOrdersQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createOrder(dto: ExtCreateOrderDto & { nick: string }): Promise<void> {
    const hireId = await this.hiresService.createHire(dto);
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    const order = await this.create({ ...dto, stationId: hireId });
    this.mqttService.publishNotification(
      order.id,
      0,
      dto.nick,
      Notification.CREATED_ORDER,
    );
  }

  async editOrder(dto: ExtEditOrderDto): Promise<void> {
    const order = await this.checkOrderCustomer(
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.CREATED) {
      throw new AppException(OrderError.ALREADY_TAKEN);
    }
    if (dto.price !== order.price) {
      if (dto.price < order.price) {
        await this.cardsService.increaseCardBalance({
          cardId: order.hire.cardId,
          sum: order.price - dto.price,
        });
      } else {
        await this.cardsService.decreaseCardBalance({
          cardId: order.hire.cardId,
          sum: dto.price - order.price,
        });
      }
    }
    await this.edit(order, dto);
  }

  async takeOrder(dto: ExtTakeOrderDto & { nick: string }): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    const order = await this.ordersRepository.findOne({
      relations: ['hire', 'hire.card'],
      where: { id: dto.orderId },
    });
    if (order.status !== Status.CREATED) {
      throw new AppException(OrderError.ALREADY_TAKEN);
    }
    if (order.hire.completedAt < new Date()) {
      throw new AppException(OrderError.ALREADY_EXPIRED);
    }
    await this.take(order, dto.cardId);
    this.mqttService.publishNotification(
      dto.orderId,
      order.hire.card.userId,
      dto.nick,
      Notification.TAKEN_ORDER,
    );
  }

  async untakeOrder(dto: ExtOrderIdDto & { nick: string }): Promise<void> {
    const order = await this.checkOrderExecutor(
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.TAKEN) {
      throw new AppException(OrderError.NOT_TAKEN);
    }
    await this.untake(order);
    this.mqttService.publishNotification(
      dto.orderId,
      order.hire.card.userId,
      dto.nick,
      Notification.UNTAKEN_ORDER,
    );
  }

  async executeOrder(dto: ExtOrderIdDto & { nick: string }): Promise<void> {
    const order = await this.checkOrderExecutor(
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.TAKEN) {
      throw new AppException(OrderError.NOT_TAKEN);
    }
    await this.execute(order);
    this.mqttService.publishNotification(
      dto.orderId,
      order.hire.card.userId,
      dto.nick,
      Notification.EXECUTED_ORDER,
    );
  }

  async completeOrder(
    dto: ExtCompleteOrderDto & { nick: string },
  ): Promise<void> {
    const order = await this.checkOrderCustomer(
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.EXECUTED) {
      throw new AppException(OrderError.NOT_EXECUTED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: order.hire.cardId,
      sum: order.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: order.hire.cardId,
      receiverCardId: order.executorCardId,
      sum: order.price,
      description: '',
    });
    try {
      await this.hiresService.completeHire({ ...dto, hireId: order.hireId });
    } catch (error) {}
    await this.complete(order, dto.rate);
    this.unpublishNotification(dto.orderId, dto.nick);
    this.mqttService.publishNotification(
      dto.orderId,
      order.executorCard.userId,
      dto.nick,
      Notification.COMPLETED_ORDER,
    );
    if (dto.rate) {
      this.mqttService.publishNotification(
        dto.orderId,
        order.executorCard.userId,
        dto.nick,
        Notification.RATED_ORDER,
      );
    }
  }

  async deleteOrder(dto: ExtOrderIdDto & { nick: string }): Promise<void> {
    const order = await this.checkOrderCustomer(
      dto.orderId,
      dto.myId,
      dto.hasRole,
    );
    if (order.status !== Status.CREATED) {
      throw new AppException(OrderError.ALREADY_TAKEN);
    }
    await this.cardsService.increaseCardBalance({
      cardId: order.hire.cardId,
      sum: order.price,
    });
    try {
      await this.hiresService.completeHire({ ...dto, hireId: order.hireId });
    } catch (error) {}
    await this.delete(order);
    this.unpublishNotification(dto.orderId, dto.nick);
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
      relations: [
        'hire',
        'hire.card',
        'hire.card.account',
        'hire.card.account.cards',
        'executorCard',
      ],
      where: {
        id,
        hire: { card: { account: { cards: { completedAt: IsNull() } } } },
      },
    });
    const card = order.hire.card.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
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
      relations: [
        'executorCard',
        'executorCard.account',
        'executorCard.account.cards',
        'hire',
        'hire.card',
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

  private async create(dto: ExtCreateOrderDto): Promise<Order> {
    try {
      const order = this.ordersRepository.create({
        hireId: dto.stationId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.ordersRepository.save(order);
      return order;
    } catch (error) {
      throw new AppException(OrderError.CREATE_FAILED);
    }
  }

  private async edit(order: Order, dto: ExtEditOrderDto): Promise<void> {
    try {
      order.item = dto.item;
      order.description = dto.description;
      order.amount = dto.amount;
      order.intake = dto.intake;
      order.kit = dto.kit;
      order.price = dto.price;
      await this.ordersRepository.save(order);
    } catch (error) {
      throw new AppException(OrderError.EDIT_FAILED);
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

  private async complete(order: Order, rate: number): Promise<void> {
    try {
      order.completedAt = new Date();
      order.status = Status.COMPLETED;
      order.rate = rate || null;
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

  private unpublishNotification(id: number, nick: string): void {
    this.mqttService.unpublishNotification(
      id,
      0,
      nick,
      Notification.CREATED_ORDER,
    );
  }

  private getOrdersQueryBuilder(req: Request): SelectQueryBuilder<Order> {
    return this.ordersRepository
      .createQueryBuilder('order')
      .innerJoin('order.hire', 'hire')
      .innerJoin('hire.box', 'box')
      .innerJoin('box.station', 'station')
      .innerJoin('station.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('hire.card', 'customerCard')
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
            .where(`${!req.station}`)
            .orWhere('station.id = :stationId', { stationId: req.station }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.box}`)
            .orWhere('box.id = :boxId', { boxId: req.box }),
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
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('order.completedAt IS NOT NULL')
            .orWhere('hire.completedAt < NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where('order.completedAt IS NULL')
                  .andWhere('hire.completedAt > NOW()'),
              ),
            ),
        ),
      )
      .orderBy('order.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'order.id',
        'hire.id',
        'box.id',
        'station.id',
        'ownerCard.id',
        'ownerAccount.id',
        'ownerAccount.name',
        'ownerAccount.color',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'station.name',
        'station.x',
        'station.y',
        'box.name',
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
        'order.price',
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
