import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
import { Delivery } from './delivery.entity';
import { PurchasesService } from '../purchases/purchases.service';
import { CardsService } from '../cards/cards.service';
import { TransactionsService } from '../transactions/transactions.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCompleteDeliveryDto,
  ExtCreateDeliveryDto,
  ExtDeliveryIdDto,
  ExtEditDeliveryDto,
  ExtTakeDeliveryDto,
} from './delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { DeliveryError } from './delivery-error.enum';
import { Status } from '../transportations/status.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class DeliveriesService {
  private deliveriesRepositoryMap: Map<string, Repository<Delivery>>;

  constructor(
    @InjectRepository(Delivery, Database.DB1)
    private deliveries1Repository: Repository<Delivery>,
    @InjectRepository(Delivery, Database.DB2)
    private deliveries2Repository: Repository<Delivery>,
    @Inject(forwardRef(() => PurchasesService))
    private purchasesService: PurchasesService,
    private cardsService: CardsService,
    private transactionsService: TransactionsService,
    private mqttService: MqttService,
  ) {
    this.deliveriesRepositoryMap = new Map(
      [this.deliveries1Repository, this.deliveries2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMainDeliveries(
    project: string,
    req: Request,
  ): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(project, req)
      .andWhere('delivery.status = :status', {
        status: Status.CREATED,
      })
      .getManyAndCount();
    return { result, count };
  }

  async getMyDeliveries(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(project, req)
      .innerJoin('customerAccount.cards', 'customerCards')
      .andWhere('customerCards.userId = :myId', { myId })
      .andWhere('customerCards.completedAt IS NULL')
      .getManyAndCount();
    return { result, count };
  }

  async getTakenDeliveries(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(project, req)
      .leftJoin('executorAccount.cards', 'executorCards')
      .andWhere('executorCards.userId = :myId', { myId })
      .andWhere('executorCards.completedAt IS NULL')
      .getManyAndCount();
    return { result, count };
  }

  async getAllDeliveries(
    project: string,
    req: Request,
  ): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createDelivery(
    project: string,
    dto: ExtCreateDeliveryDto,
  ): Promise<void> {
    const purchase = await this.purchasesService.checkPurchaseOwner(
      project,
      dto.purchaseId,
      dto.myId,
      dto.hasRole,
    );
    const delivery = await this.deliveriesRepositoryMap.get(project).findOneBy({
      purchaseId: dto.purchaseId,
    });
    if (delivery) {
      throw new AppException(DeliveryError.ALREADY_EXISTS);
    }
    const card = await this.cardsService.checkCardUser(
      project,
      dto.cardId,
      dto.myId,
      dto.hasRole,
    );
    await this.transactionsService.createDecreaseTransaction(project, {
      cardId: dto.cardId,
      sum: dto.sum,
      description: 'створення доставки',
      item: purchase.good.item,
    });
    const result = await this.create(project, dto);
    this.mqttService.publishNotification(
      project,
      result.id,
      0,
      card.userId,
      Notification.CREATED_DELIVERY,
    );
  }

  async editDelivery(project: string, dto: ExtEditDeliveryDto): Promise<void> {
    const delivery = await this.checkDeliveryCustomer(
      project,
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.CREATED) {
      throw new AppException(DeliveryError.ALREADY_TAKEN);
    }
    if (delivery.sum !== dto.sum) {
      if (delivery.sum > dto.sum) {
        await this.transactionsService.createIncreaseTransaction(project, {
          cardId: delivery.customerCardId,
          sum: delivery.sum - dto.sum,
          description: 'редагування доставки',
          item: delivery.purchase.good.item,
        });
      } else {
        await this.transactionsService.createDecreaseTransaction(project, {
          cardId: delivery.customerCardId,
          sum: dto.sum - delivery.sum,
          description: 'редагування доставки',
          item: delivery.purchase.good.item,
        });
      }
    }
    await this.edit(project, delivery, dto);
  }

  async takeDelivery(project: string, dto: ExtTakeDeliveryDto): Promise<void> {
    const card = await this.cardsService.checkCardUser(
      project,
      dto.cardId,
      dto.myId,
      dto.hasRole,
    );
    const delivery = await this.deliveriesRepositoryMap.get(project).findOne({
      relations: ['customerCard'],
      where: { id: dto.deliveryId },
    });
    if (delivery.status !== Status.CREATED) {
      throw new AppException(DeliveryError.ALREADY_TAKEN);
    }
    await this.take(project, delivery, dto.cardId);
    this.mqttService.publishNotification(
      project,
      dto.deliveryId,
      delivery.customerCard.userId,
      card.userId,
      Notification.TAKEN_DELIVERY,
    );
  }

  async untakeDelivery(project: string, dto: ExtDeliveryIdDto): Promise<void> {
    const delivery = await this.checkDeliveryExecutor(
      project,
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.TAKEN) {
      throw new AppException(DeliveryError.NOT_TAKEN);
    }
    const userId = delivery.executorCard.userId;
    await this.untake(project, delivery);
    this.mqttService.publishNotification(
      project,
      dto.deliveryId,
      delivery.customerCard.userId,
      userId,
      Notification.UNTAKEN_DELIVERY,
    );
  }

  async executeDelivery(project: string, dto: ExtDeliveryIdDto): Promise<void> {
    const delivery = await this.checkDeliveryExecutor(
      project,
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.TAKEN) {
      throw new AppException(DeliveryError.NOT_TAKEN);
    }
    await this.execute(project, delivery);
    this.mqttService.publishNotification(
      project,
      dto.deliveryId,
      delivery.customerCard.userId,
      delivery.executorCard.userId,
      Notification.EXECUTED_DELIVERY,
    );
  }

  async completeDelivery(
    project: string,
    dto: ExtCompleteDeliveryDto,
  ): Promise<void> {
    const delivery = await this.checkDeliveryCustomer(
      project,
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.EXECUTED) {
      throw new AppException(DeliveryError.NOT_EXECUTED);
    }
    await this.transactionsService.createIncreaseTransaction(project, {
      cardId: delivery.customerCardId,
      sum: delivery.sum,
      description: 'завершення доставки',
      item: delivery.purchase.good.item,
    });
    await this.transactionsService.createTransfer(project, {
      myId: dto.myId,
      hasRole: dto.hasRole,
      senderCardId: delivery.customerCardId,
      receiverCardId: delivery.executorCardId,
      sum: delivery.sum,
      description: `виконання доставки ${delivery.id}`,
      item: delivery.purchase.good.item,
    });
    await this.complete(project, delivery, dto.rate);
    this.unpublishNotification(
      project,
      dto.deliveryId,
      delivery.customerCard.userId,
    );
    this.mqttService.publishNotification(
      project,
      dto.deliveryId,
      delivery.executorCard.userId,
      delivery.customerCard.userId,
      Notification.COMPLETED_DELIVERY,
    );
    if (dto.rate) {
      this.mqttService.publishNotification(
        project,
        dto.deliveryId,
        delivery.executorCard.userId,
        delivery.customerCard.userId,
        Notification.RATED_DELIVERY,
      );
    }
  }

  async deleteDelivery(project: string, dto: ExtDeliveryIdDto): Promise<void> {
    const delivery = await this.checkDeliveryCustomer(
      project,
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.CREATED) {
      throw new AppException(DeliveryError.ALREADY_TAKEN);
    }
    await this.transactionsService.createIncreaseTransaction(project, {
      cardId: delivery.customerCardId,
      sum: delivery.sum,
      description: 'видалення доставки',
      item: delivery.purchase.good.item,
    });
    await this.delete(project, delivery);
    this.unpublishNotification(
      project,
      dto.deliveryId,
      delivery.customerCard.userId,
    );
  }

  async checkDeliveryExists(project: string, id: number): Promise<void> {
    await this.deliveriesRepositoryMap.get(project).findOneByOrFail({ id });
  }

  private async checkDeliveryCustomer(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Delivery> {
    const delivery = await this.deliveriesRepositoryMap.get(project).findOne({
      relations: [
        'customerCard',
        'customerCard.account',
        'customerCard.account.cards',
        'executorCard',
        'purchase',
        'purchase.good',
      ],
      where: {
        id,
        customerCard: { account: { cards: { completedAt: IsNull() } } },
      },
    });
    const card = delivery.customerCard.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(DeliveryError.NOT_CUSTOMER);
    }
    return delivery;
  }

  private async checkDeliveryExecutor(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Delivery> {
    const delivery = await this.deliveriesRepositoryMap.get(project).findOne({
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
    const card = delivery.executorCard.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(DeliveryError.NOT_EXECUTOR);
    }
    return delivery;
  }

  private async create(
    project: string,
    dto: ExtCreateDeliveryDto,
  ): Promise<Delivery> {
    try {
      const delivery = this.deliveriesRepositoryMap.get(project).create({
        stationId: dto.stationId,
        customerCardId: dto.cardId,
        purchaseId: dto.purchaseId,
        sum: dto.sum,
      });
      await this.deliveriesRepositoryMap.get(project).save(delivery);
      return delivery;
    } catch (error) {
      throw new AppException(DeliveryError.CREATE_FAILED);
    }
  }

  private async edit(
    project: string,
    delivery: Delivery,
    dto: ExtEditDeliveryDto,
  ): Promise<void> {
    try {
      delivery.sum = dto.sum;
      await this.deliveriesRepositoryMap.get(project).save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.EDIT_FAILED);
    }
  }

  private async take(
    project: string,
    delivery: Delivery,
    cardId: number,
  ): Promise<void> {
    try {
      delivery.executorCardId = cardId;
      delivery.status = Status.TAKEN;
      await this.deliveriesRepositoryMap.get(project).save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.TAKE_FAILED);
    }
  }

  private async untake(project: string, delivery: Delivery): Promise<void> {
    try {
      delivery.executorCard = null;
      delivery.executorCardId = null;
      delivery.status = Status.CREATED;
      await this.deliveriesRepositoryMap.get(project).save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.UNTAKE_FAILED);
    }
  }

  private async execute(project: string, delivery: Delivery): Promise<void> {
    try {
      delivery.status = Status.EXECUTED;
      await this.deliveriesRepositoryMap.get(project).save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.EXECUTE_FAILED);
    }
  }

  private async complete(
    project: string,
    delivery: Delivery,
    rate: number,
  ): Promise<void> {
    try {
      delivery.completedAt = new Date();
      delivery.status = Status.COMPLETED;
      delivery.rate = rate || null;
      await this.deliveriesRepositoryMap.get(project).save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.COMPLETE_FAILED);
    }
  }

  private async delete(project: string, delivery: Delivery): Promise<void> {
    try {
      await this.deliveriesRepositoryMap.get(project).remove(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.DELETE_FAILED);
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
      Notification.CREATED_DELIVERY,
    );
  }

  private getDeliveriesQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Delivery> {
    return this.deliveriesRepositoryMap
      .get(project)
      .createQueryBuilder('delivery')
      .innerJoin('delivery.purchase', 'purchase')
      .innerJoin('purchase.good', 'good')
      .innerJoin('good.shop', 'shop')
      .innerJoin('shop.card', 'shopCard')
      .innerJoin('shopCard.account', 'shopAccount')
      .innerJoin('shopCard.user', 'shopUser')
      .innerJoin('delivery.station', 'station')
      .innerJoin('station.user', 'stationUser')
      .innerJoin('delivery.customerCard', 'customerCard')
      .innerJoin('customerCard.account', 'customerAccount')
      .innerJoin('customerCard.user', 'customerUser')
      .leftJoin('delivery.executorCard', 'executorCard')
      .leftJoin('executorCard.account', 'executorAccount')
      .leftJoin('executorCard.user', 'executorUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('delivery.id = :id', { id: req.id }),
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
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where('shopUser.id = :userId')
                        .orWhere('stationUser.id = :userId'),
                    ),
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
                  .andWhere('shopCard.id = :cardId'),
              ),
            ),
        ),
        { cardId: req.card },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.shop}`)
            .orWhere('shop.id = :shopId', { shopId: req.shop }),
        ),
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
            .orWhere('good.item = :item', { item: req.item }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('good.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minAmount}`)
            .orWhere('purchase.amount >= :minAmount', {
              minAmount: req.minAmount,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxAmount}`)
            .orWhere('purchase.amount <= :maxAmount', {
              maxAmount: req.maxAmount,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minIntake}`)
            .orWhere('good.intake >= :minIntake', { minIntake: req.minIntake }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxIntake}`)
            .orWhere('good.intake <= :maxIntake', { maxIntake: req.maxIntake }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.kit}`).orWhere('good.kit = :kit', { kit: req.kit }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.minSum}`).orWhere('delivery.sum >= :minSum', {
            minSum: req.minSum,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxSum}`).orWhere('delivery.sum <= :maxSum', {
            maxSum: req.maxSum,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.status}`)
            .orWhere('delivery.status = :status', { status: req.status }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('delivery.createdAt >= :minDate', {
              minDate: req.minDate,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('delivery.createdAt <= :maxDate', {
              maxDate: req.maxDate,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('delivery.completedAt IS NOT NULL'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('delivery.completedAt IS NULL'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('delivery.rate = :rate', { rate: req.rate }),
        ),
      )
      .orderBy('delivery.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'delivery.id',
        'purchase.id',
        'good.id',
        'shop.id',
        'shopCard.id',
        'shopAccount.id',
        'shopAccount.name',
        'shopAccount.color',
        'shopUser.id',
        'shopUser.nick',
        'shopUser.avatar',
        'shop.name',
        'shop.x',
        'shop.y',
        'good.item',
        'good.description',
        'good.intake',
        'good.kit',
        'purchase.amount',
        'station.id',
        'stationUser.id',
        'stationUser.nick',
        'stationUser.avatar',
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
        'delivery.sum',
        'delivery.status',
        'executorCard.id',
        'executorAccount.id',
        'executorAccount.name',
        'executorAccount.color',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'delivery.createdAt',
        'delivery.completedAt',
        'delivery.rate',
      ]);
  }
}
