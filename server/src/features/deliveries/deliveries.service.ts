import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Delivery } from './delivery.entity';
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
      .andWhere('fromHire.completedAt > NOW()')
      .andWhere('toHire.completedAt > NOW()')
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
      .innerJoin('fromOwnerCard.users', 'fromOwnerUsers')
      .innerJoin('toOwnerCard.users', 'toOwnerUsers')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('fromOwnerUsers.id = :myId')
            .orWhere('toOwnerUsers.id = :myId'),
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
    const fromHireId = await this.hiresService.createHire({
      ...dto,
      stationId: dto.fromStationId,
    });
    const toHireId = await this.hiresService.createHire({
      ...dto,
      stationId: dto.toStationId,
    });
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    const delivery = await this.create({
      ...dto,
      fromStationId: fromHireId,
      toStationId: toHireId,
    });
    this.mqttService.publishNotificationMessage(
      delivery.id,
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
      throw new AppException(DeliveryError.NOT_CREATED);
    }
    if (dto.price !== delivery.price) {
      if (dto.price < delivery.price) {
        await this.cardsService.increaseCardBalance({
          cardId: delivery.fromHire.cardId,
          sum: delivery.price - dto.price,
        });
      } else {
        await this.cardsService.decreaseCardBalance({
          cardId: delivery.fromHire.cardId,
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
      relations: ['fromHire', 'fromHire.card', 'toHire'],
      where: { id: dto.deliveryId },
    });
    if (delivery.status !== Status.CREATED) {
      throw new AppException(DeliveryError.NOT_CREATED);
    }
    if (
      delivery.fromHire.completedAt < new Date() ||
      delivery.toHire.completedAt < new Date()
    ) {
      throw new AppException(DeliveryError.ALREADY_EXPIRED);
    }
    await this.take(delivery, dto.cardId);
    this.mqttService.publishNotificationMessage(
      dto.deliveryId,
      delivery.fromHire.card.userId,
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
    this.mqttService.publishNotificationMessage(
      dto.deliveryId,
      delivery.fromHire.card.userId,
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
    this.mqttService.publishNotificationMessage(
      dto.deliveryId,
      delivery.fromHire.card.userId,
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
      cardId: delivery.fromHire.cardId,
      sum: delivery.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: delivery.fromHire.cardId,
      receiverCardId: delivery.executorCardId,
      sum: delivery.price,
      description: '',
    });
    await this.hiresService.completeHire({
      ...dto,
      hireId: delivery.fromHireId,
    });
    await this.hiresService.completeHire({
      ...dto,
      hireId: delivery.toHireId,
    });
    await this.complete(delivery);
    this.mqttService.publishNotificationMessage(
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
      throw new AppException(DeliveryError.NOT_CREATED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: delivery.fromHire.cardId,
      sum: delivery.price,
    });
    await this.hiresService.completeHire({
      ...dto,
      hireId: delivery.fromHireId,
    });
    await this.hiresService.completeHire({
      ...dto,
      hireId: delivery.toHireId,
    });
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
    this.mqttService.publishNotificationMessage(
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
      relations: [
        'fromHire',
        'fromHire.card',
        'fromHire.card.users',
        'executorCard',
      ],
      where: { id },
    });
    if (
      !delivery.fromHire.card.users.map((user) => user.id).includes(userId) &&
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
      relations: [
        'executorCard',
        'executorCard.users',
        'fromHire',
        'fromHire.card',
      ],
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

  private async create(dto: ExtCreateDeliveryDto): Promise<Delivery> {
    try {
      const delivery = this.deliveriesRepository.create({
        fromHireId: dto.fromStationId,
        toHireId: dto.toStationId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
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
      delivery.item = dto.item;
      delivery.description = dto.description;
      delivery.amount = dto.amount;
      delivery.intake = dto.intake;
      delivery.kit = dto.kit;
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
      delivery.completedAt = new Date();
      delivery.status = Status.COMPLETED;
      await this.deliveriesRepository.save(delivery);
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
      .innerJoin('delivery.fromHire', 'fromHire')
      .innerJoin('fromHire.drawer', 'fromDrawer')
      .innerJoin('fromDrawer.station', 'fromStation')
      .innerJoin('fromStation.card', 'fromOwnerCard')
      .innerJoin('fromOwnerCard.user', 'fromOwnerUser')
      .innerJoin('delivery.toHire', 'toHire')
      .innerJoin('toHire.drawer', 'toDrawer')
      .innerJoin('toDrawer.station', 'toStation')
      .innerJoin('toStation.card', 'toOwnerCard')
      .innerJoin('toOwnerCard.user', 'toOwnerUser')
      .innerJoin('fromHire.card', 'customerCard')
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
                    'fromOwnerUser.id = :userId OR toOwnerUser.id = :userId',
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
                    'fromOwnerCard.id = :cardId OR toOwnerCard.id = :cardId',
                  ),
              ),
            ),
        ),
        { cardId: req.card },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.station}`, { stationId: req.station })
            .orWhere('fromStation.id = :stationId')
            .orWhere('toStation.id = :stationId'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.drawer}`, { drawerId: req.drawer })
            .orWhere('fromDrawer.id = :drawerId')
            .orWhere('toDrawer.id = :drawerId'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.item}`)
            .orWhere('delivery.item = :item', { item: req.item }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('delivery.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minAmount}`)
            .orWhere('delivery.amount >= :minAmount', {
              minAmount: req.minAmount,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxAmount}`)
            .orWhere('delivery.amount <= :maxAmount', {
              maxAmount: req.maxAmount,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minIntake}`)
            .orWhere('delivery.intake >= :minIntake', {
              minIntake: req.minIntake,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxIntake}`)
            .orWhere('delivery.intake <= :maxIntake', {
              maxIntake: req.maxIntake,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.kit}`)
            .orWhere('delivery.kit = :kit', { kit: req.kit }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('delivery.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('delivery.price <= :maxPrice', { maxPrice: req.maxPrice }),
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
      .orderBy('delivery.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'delivery.id',
        'fromHire.id',
        'fromDrawer.id',
        'fromStation.id',
        'fromOwnerCard.id',
        'fromOwnerUser.id',
        'fromOwnerUser.nick',
        'fromOwnerUser.avatar',
        'fromOwnerCard.name',
        'fromOwnerCard.color',
        'fromStation.name',
        'fromStation.x',
        'fromStation.y',
        'fromDrawer.name',
        'toHire.id',
        'toDrawer.id',
        'toStation.id',
        'toOwnerCard.id',
        'toOwnerUser.id',
        'toOwnerUser.nick',
        'toOwnerUser.avatar',
        'toOwnerCard.name',
        'toOwnerCard.color',
        'toStation.name',
        'toStation.x',
        'toStation.y',
        'toDrawer.name',
        'customerCard.id',
        'customerUser.id',
        'customerUser.nick',
        'customerUser.avatar',
        'customerCard.name',
        'customerCard.color',
        'delivery.item',
        'delivery.description',
        'delivery.amount',
        'delivery.intake',
        'delivery.kit',
        'delivery.price',
        'delivery.status',
        'delivery.createdAt',
        'executorCard.id',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'executorCard.name',
        'executorCard.color',
        'delivery.completedAt',
        'delivery.rate',
      ]);
  }
}
