import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Delivery } from './delivery.entity';
import { LeasesService } from '../leases/leases.service';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateDeliveryDto,
  ExtDeliveryIdDto,
  ExtRateDeliveryDto,
  ExtTakeDeliveryDto,
} from './delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { DeliveryError } from './delivery-error.enum';
import { Status } from '../transportations/status.enum';
import { Kind } from '../leases/kind.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private deliveriesRepository: Repository<Delivery>,
    private leasesService: LeasesService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainDeliveries(req: Request): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(req)
      .andWhere('delivery.createdAt > :date', { date: getDateWeekAgo() })
      .andWhere('delivery.status = :status', {
        status: Status.CREATED,
      })
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

  async createDelivery(dto: ExtCreateDeliveryDto): Promise<void> {
    const fromLeaseId = await this.leasesService.createLease({
      ...dto,
      storageId: dto.fromStorageId,
      kind: Kind.DELIVERY,
    });
    const toLeaseId = await this.leasesService.createLease({
      ...dto,
      storageId: dto.toStorageId,
      kind: Kind.DELIVERY,
    });
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    await this.create({
      ...dto,
      fromStorageId: fromLeaseId,
      toStorageId: toLeaseId,
    });
  }

  async takeDelivery(dto: ExtTakeDeliveryDto): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    const delivery = await this.deliveriesRepository.findOne({
      relations: ['fromLease', 'fromLease.card'],
      where: { id: dto.deliveryId },
    });
    if (delivery.createdAt < getDateWeekAgo()) {
      throw new AppException(DeliveryError.ALREADY_EXPIRED);
    }
    if (delivery.status !== Status.CREATED) {
      throw new AppException(DeliveryError.NOT_CREATED);
    }
    await this.take(delivery, dto.cardId);
    this.mqttService.publishNotificationMessage(
      delivery.fromLease.card.userId,
      Notification.TAKEN_DELIVERY,
    );
  }

  async untakeDelivery(dto: ExtDeliveryIdDto): Promise<void> {
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
      delivery.fromLease.card.userId,
      Notification.UNTAKEN_DELIVERY,
    );
  }

  async executeDelivery(dto: ExtDeliveryIdDto): Promise<void> {
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
      delivery.fromLease.card.userId,
      Notification.EXECUTED_DELIVERY,
    );
  }

  async completeDelivery(dto: ExtDeliveryIdDto): Promise<void> {
    const delivery = await this.checkDeliveryCustomer(
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.EXECUTED) {
      throw new AppException(DeliveryError.NOT_EXECUTED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: delivery.fromLease.cardId,
      sum: delivery.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      hasRole: dto.hasRole,
      senderCardId: delivery.fromLease.cardId,
      receiverCardId: delivery.executorCardId,
      sum: delivery.price,
      description: '',
    });
    await this.complete(delivery);
    this.mqttService.publishNotificationMessage(
      delivery.executorCard.userId,
      Notification.COMPLETED_DELIVERY,
    );
  }

  async deleteDelivery(dto: ExtDeliveryIdDto): Promise<void> {
    const delivery = await this.checkDeliveryCustomer(
      dto.deliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (delivery.status !== Status.CREATED) {
      throw new AppException(DeliveryError.NOT_CREATED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: delivery.fromLease.cardId,
      sum: delivery.price,
    });
    await this.delete(delivery);
  }

  async rateDelivery(dto: ExtRateDeliveryDto): Promise<void> {
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
      delivery.executorCard.userId,
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
        'fromLease',
        'fromLease.card',
        'fromLease.card.users',
        'executorCard',
      ],
      where: { id },
    });
    if (
      !delivery.fromLease.card.users.map((user) => user.id).includes(userId) &&
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
        'fromLease',
        'fromLease.card',
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

  private async create(dto: ExtCreateDeliveryDto): Promise<void> {
    try {
      const delivery = this.deliveriesRepository.create({
        fromLeaseId: dto.fromStorageId,
        toLeaseId: dto.toStorageId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.deliveriesRepository.save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.CREATE_FAILED);
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
      delivery.rate = rate || null;
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
      .innerJoin('delivery.fromLease', 'fromLease')
      .innerJoin('fromLease.cell', 'fromCell')
      .innerJoin('fromCell.storage', 'fromStorage')
      .innerJoin('fromStorage.card', 'fromOwnerCard')
      .innerJoin('fromOwnerCard.user', 'fromOwnerUser')
      .innerJoin('delivery.toLease', 'toLease')
      .innerJoin('toLease.cell', 'toCell')
      .innerJoin('toCell.storage', 'toStorage')
      .innerJoin('toStorage.card', 'toOwnerCard')
      .innerJoin('toOwnerCard.user', 'toOwnerUser')
      .innerJoin('fromLease.card', 'customerCard')
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
            .where(`${!req.storage}`, { storageId: req.storage })
            .orWhere('fromStorage.id = :storageId')
            .orWhere('toStorage.id = :storageId'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.cell}`, { cellId: req.cell })
            .orWhere('fromCell.id = :cellId')
            .orWhere('toCell.id = :cellId'),
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
        'fromLease.id',
        'fromCell.id',
        'fromStorage.id',
        'fromOwnerCard.id',
        'fromOwnerUser.id',
        'fromOwnerUser.nick',
        'fromOwnerCard.name',
        'fromOwnerCard.color',
        'fromStorage.name',
        'fromStorage.x',
        'fromStorage.y',
        'fromCell.name',
        'toLease.id',
        'toCell.id',
        'toStorage.id',
        'toOwnerCard.id',
        'toOwnerUser.id',
        'toOwnerUser.nick',
        'toOwnerCard.name',
        'toOwnerCard.color',
        'toStorage.name',
        'toStorage.x',
        'toStorage.y',
        'toCell.name',
        'customerCard.id',
        'customerUser.id',
        'customerUser.nick',
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
        'executorCard.name',
        'executorCard.color',
        'delivery.completedAt',
        'delivery.rate',
      ]);
  }
}
