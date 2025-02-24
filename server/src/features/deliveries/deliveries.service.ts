import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Delivery } from './delivery.entity';
import { PurchasesService } from '../purchases/purchases.service';
import { HiresService } from '../hires/hires.service';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateDeliveryDto,
  ExtDeliveryIdDto,
  ExtEditDeliveryDto,
  ExtRateDeliveryDto,
  ExtTakeDeliveryDto,
} from './delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { DeliveryError } from './delivery-error.enum';
import { Status } from '../transportations/status.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private deliveriesRepository: Repository<Delivery>,
    @Inject(forwardRef(() => PurchasesService))
    private purchasesService: PurchasesService,
    private hiresService: HiresService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainDeliveries(req: Request): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(req)
      .andWhere('delivery.status = :status', {
        status: Status.CREATED,
      })
      .andWhere('hire.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(req)
      .innerJoin('customerCard.users', 'customerUsers')
      .andWhere('customerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getTakenDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(req)
      .leftJoin('executorCard.users', 'executorUsers')
      .andWhere('executorUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(req)
      .leftJoin('shopCard.users', 'shopUsers')
      .leftJoin('marketCard.users', 'marketUsers')
      .leftJoin('storageCard.users', 'storageUsers')
      .innerJoin('stationCard.users', 'stationUsers')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('shopUsers.id = :myId')
            .orWhere('marketUsers.id = :myId')
            .orWhere('storageUsers.id = :myId')
            .orWhere('stationUsers.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllDeliveries(req: Request): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createDelivery(
    dto: ExtCreateDeliveryDto & { nick: string },
  ): Promise<void> {
    await this.purchasesService.checkPurchaseOwner(
      dto.purchaseId,
      dto.myId,
      dto.hasRole,
    );
    const delivery = await this.deliveriesRepository.findOneBy({
      purchaseId: dto.purchaseId,
    });
    if (delivery) {
      throw new AppException(DeliveryError.ALREADY_EXISTS);
    }
    const hireId = await this.hiresService.createHire(dto);
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    const result = await this.create(dto, hireId);
    this.mqttService.publishNotification(
      result.id,
      0,
      dto.nick,
      Notification.CREATED_DELIVERY,
    );
  }

  async editDelivery(dto: ExtEditDeliveryDto): Promise<void> {
    const delivery = await this.checkDeliveryCustomer(
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.CREATED) {
      throw new AppException(DeliveryError.ALREADY_TAKEN);
    }
    if (dto.price !== delivery.price) {
      if (dto.price < delivery.price) {
        await this.cardsService.increaseCardBalance({
          cardId: delivery.hire.cardId,
          sum: delivery.price - dto.price,
        });
      } else {
        await this.cardsService.decreaseCardBalance({
          cardId: delivery.hire.cardId,
          sum: dto.price - delivery.price,
        });
      }
    }
    await this.edit(delivery, dto);
  }

  async takeDelivery(
    dto: ExtTakeDeliveryDto & { nick: string },
  ): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    const delivery = await this.deliveriesRepository.findOne({
      relations: ['hire', 'hire.card'],
      where: { id: dto.deliveryId },
    });
    if (delivery.status !== Status.CREATED) {
      throw new AppException(DeliveryError.ALREADY_TAKEN);
    }
    if (delivery.hire.completedAt < new Date()) {
      throw new AppException(DeliveryError.ALREADY_EXPIRED);
    }
    await this.take(delivery, dto.cardId);
    this.mqttService.publishNotification(
      dto.deliveryId,
      delivery.hire.card.userId,
      dto.nick,
      Notification.TAKEN_DELIVERY,
    );
  }

  async untakeDelivery(
    dto: ExtDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const delivery = await this.checkDeliveryExecutor(
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.TAKEN) {
      throw new AppException(DeliveryError.NOT_TAKEN);
    }
    await this.untake(delivery);
    this.mqttService.publishNotification(
      dto.deliveryId,
      delivery.hire.card.userId,
      dto.nick,
      Notification.UNTAKEN_DELIVERY,
    );
  }

  async executeDelivery(
    dto: ExtDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const delivery = await this.checkDeliveryExecutor(
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.TAKEN) {
      throw new AppException(DeliveryError.NOT_TAKEN);
    }
    await this.execute(delivery);
    this.mqttService.publishNotification(
      dto.deliveryId,
      delivery.hire.card.userId,
      dto.nick,
      Notification.EXECUTED_DELIVERY,
    );
  }

  async completeDelivery(
    dto: ExtDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const delivery = await this.checkDeliveryCustomer(
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.EXECUTED) {
      throw new AppException(DeliveryError.NOT_EXECUTED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: delivery.hire.cardId,
      sum: delivery.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: delivery.hire.cardId,
      receiverCardId: delivery.executorCardId,
      sum: delivery.price,
      description: '',
    });
    try {
      await this.hiresService.completeHire({
        ...dto,
        hireId: delivery.hireId,
      });
    } catch (error) {}
    await this.complete(delivery);
    this.mqttService.publishNotification(
      dto.deliveryId,
      delivery.executorCard.userId,
      dto.nick,
      Notification.COMPLETED_DELIVERY,
    );
  }

  async deleteDelivery(
    dto: ExtDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const delivery = await this.checkDeliveryCustomer(
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.CREATED) {
      throw new AppException(DeliveryError.ALREADY_TAKEN);
    }
    await this.cardsService.increaseCardBalance({
      cardId: delivery.hire.cardId,
      sum: delivery.price,
    });
    try {
      await this.hiresService.completeHire({
        ...dto,
        hireId: delivery.hireId,
      });
    } catch (error) {}
    await this.delete(delivery);
  }

  async rateDelivery(
    dto: ExtRateDeliveryDto & { nick: string },
  ): Promise<void> {
    const delivery = await this.checkDeliveryCustomer(
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.COMPLETED) {
      throw new AppException(DeliveryError.NOT_COMPLETED);
    }
    await this.rate(delivery, dto.rate);
    this.mqttService.publishNotification(
      dto.deliveryId,
      delivery.executorCard.userId,
      dto.nick,
      Notification.RATED_DELIVERY,
    );
  }

  async checkDeliveryExists(id: number): Promise<void> {
    await this.deliveriesRepository.findOneByOrFail({ id });
  }

  private async checkDeliveryCustomer(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Delivery> {
    const delivery = await this.deliveriesRepository.findOne({
      relations: ['hire', 'hire.card', 'hire.card.users', 'executorCard'],
      where: { id },
    });
    if (
      !delivery.hire.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(DeliveryError.NOT_CUSTOMER);
    }
    return delivery;
  }

  private async checkDeliveryExecutor(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Delivery> {
    const delivery = await this.deliveriesRepository.findOne({
      relations: ['executorCard', 'executorCard.users', 'hire', 'hire.card'],
      where: { id },
    });
    if (
      !delivery.executorCard.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(DeliveryError.NOT_EXECUTOR);
    }
    return delivery;
  }

  private async create(
    dto: ExtCreateDeliveryDto,
    hireId: number,
  ): Promise<Delivery> {
    try {
      const delivery = this.deliveriesRepository.create({
        purchaseId: dto.purchaseId,
        hireId,
        price: dto.price,
      });
      await this.deliveriesRepository.save(delivery);
      return delivery;
    } catch (error) {
      throw new AppException(DeliveryError.CREATE_FAILED);
    }
  }

  private async edit(
    delivery: Delivery,
    dto: ExtEditDeliveryDto,
  ): Promise<void> {
    try {
      delivery.price = dto.price;
      await this.deliveriesRepository.save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.EDIT_FAILED);
    }
  }

  private async take(delivery: Delivery, cardId: number): Promise<void> {
    try {
      delivery.executorCardId = cardId;
      delivery.status = Status.TAKEN;
      await this.deliveriesRepository.save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.TAKE_FAILED);
    }
  }

  private async untake(delivery: Delivery): Promise<void> {
    try {
      delivery.executorCard = null;
      delivery.executorCardId = null;
      delivery.status = Status.CREATED;
      await this.deliveriesRepository.save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.UNTAKE_FAILED);
    }
  }

  private async execute(delivery: Delivery): Promise<void> {
    try {
      delivery.status = Status.EXECUTED;
      await this.deliveriesRepository.save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.EXECUTE_FAILED);
    }
  }

  private async complete(delivery: Delivery): Promise<void> {
    try {
      delivery.completedAt = new Date();
      delivery.status = Status.COMPLETED;
      await this.deliveriesRepository.save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.COMPLETE_FAILED);
    }
  }

  private async delete(delivery: Delivery): Promise<void> {
    try {
      await this.deliveriesRepository.remove(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.DELETE_FAILED);
    }
  }

  private async rate(delivery: Delivery, rate: number): Promise<void> {
    try {
      delivery.rate = rate;
      await this.deliveriesRepository.save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.RATE_FAILED);
    }
  }

  private getDeliveriesQueryBuilder(
    req: Request,
  ): SelectQueryBuilder<Delivery> {
    return this.deliveriesRepository
      .createQueryBuilder('delivery')
      .innerJoin('delivery.purchase', 'purchase')
      .innerJoin('purchase.good', 'good')
      .leftJoin('good.shop', 'shop')
      .leftJoin('shop.card', 'shopCard')
      .leftJoin('shopCard.user', 'shopUser')
      .leftJoin('good.rent', 'rent')
      .leftJoin('rent.stall', 'stall')
      .leftJoin('stall.market', 'market')
      .leftJoin('market.card', 'marketCard')
      .leftJoin('marketCard.user', 'marketUser')
      .leftJoin('good.lease', 'lease')
      .leftJoin('lease.cell', 'cell')
      .leftJoin('cell.storage', 'storage')
      .leftJoin('storage.card', 'storageCard')
      .leftJoin('storageCard.user', 'storageUser')
      .innerJoin('delivery.hire', 'hire')
      .innerJoin('hire.box', 'box')
      .innerJoin('box.station', 'station')
      .innerJoin('station.card', 'stationCard')
      .innerJoin('stationCard.user', 'stationUser')
      .innerJoin('hire.card', 'customerCard')
      .innerJoin('customerCard.user', 'customerUser')
      .leftJoin('delivery.executorCard', 'executorCard')
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
                        .orWhere('marketUser.id = :userId')
                        .orWhere('storageUser.id = :userId')
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
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where('shopCard.id = :cardId')
                        .orWhere('marketCard.id = :cardId')
                        .orWhere('storageCard.id = :cardId')
                        .orWhere('stationCard.id = :cardId'),
                    ),
                  ),
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
            .where(`${!req.market}`)
            .orWhere('market.id = :marketId', { marketId: req.market }),
        ),
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
            .where(`${!req.station}`)
            .orWhere('station.id = :stationId', { stationId: req.station }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.stall}`)
            .orWhere('stall.id = :stallId', { stallId: req.stall }),
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
            .where(`${!req.box}`)
            .orWhere('box.id = :boxId', { boxId: req.box }),
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
          qb.where(`${!req.minPrice}`).orWhere('delivery.price >= :minPrice', {
            minPrice: req.minPrice,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxPrice}`).orWhere('delivery.price <= :maxPrice', {
            maxPrice: req.maxPrice,
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
            .where(`${!req.rate}`)
            .orWhere('delivery.rate = :rate', { rate: req.rate }),
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
            .orWhere('delivery.completedAt IS NOT NULL')
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
                  .where('delivery.completedAt IS NULL')
                  .andWhere('hire.completedAt > NOW()'),
              ),
            ),
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
        'shopUser.id',
        'shopUser.nick',
        'shopUser.avatar',
        'shopCard.name',
        'shopCard.color',
        'shop.name',
        'shop.x',
        'shop.y',
        'rent.id',
        'stall.id',
        'market.id',
        'marketCard.id',
        'marketUser.id',
        'marketUser.nick',
        'marketUser.avatar',
        'marketCard.name',
        'marketCard.color',
        'market.name',
        'market.x',
        'market.y',
        'stall.name',
        'lease.id',
        'cell.id',
        'storage.id',
        'storageCard.id',
        'storageUser.id',
        'storageUser.nick',
        'storageUser.avatar',
        'storageCard.name',
        'storageCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
        'good.item',
        'good.description',
        'good.intake',
        'good.kit',
        'purchase.amount',
        'hire.id',
        'box.id',
        'station.id',
        'stationCard.id',
        'stationUser.id',
        'stationUser.nick',
        'stationUser.avatar',
        'stationCard.name',
        'stationCard.color',
        'station.name',
        'station.x',
        'station.y',
        'box.name',
        'customerCard.id',
        'customerUser.id',
        'customerUser.nick',
        'customerUser.avatar',
        'customerCard.name',
        'customerCard.color',
        'delivery.price',
        'delivery.status',
        'executorCard.id',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'executorCard.name',
        'executorCard.color',
        'delivery.createdAt',
        'delivery.completedAt',
        'delivery.rate',
      ]);
  }
}
