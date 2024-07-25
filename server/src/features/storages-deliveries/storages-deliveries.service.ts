import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { StorageDelivery } from './storage-delivery.entity';
import { SalesService } from '../sales/sales.service';
import { HiresService } from '../hires/hires.service';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateStorageDeliveryDto,
  ExtRateStorageDeliveryDto,
  ExtStorageDeliveryIdDto,
  ExtTakeStorageDeliveryDto,
} from './storage-delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { StorageDeliveryError } from './storage-delivery-error.enum';
import { Status } from '../transportations/status.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class StoragesDeliveriesService {
  constructor(
    @InjectRepository(StorageDelivery)
    private storagesDeliveriesRepository: Repository<StorageDelivery>,
    @Inject(forwardRef(() => SalesService))
    private salesService: SalesService,
    private hiresService: HiresService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainStoragesDeliveries(
    req: Request,
  ): Promise<Response<StorageDelivery>> {
    const [result, count] = await this.getStoragesDeliveriesQueryBuilder(req)
      .andWhere('storageDelivery.status = :status', {
        status: Status.CREATED,
      })
      .andWhere('hire.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyStoragesDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<StorageDelivery>> {
    const [result, count] = await this.getStoragesDeliveriesQueryBuilder(req)
      .innerJoin('customerCard.users', 'customerUsers')
      .andWhere('customerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getTakenStoragesDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<StorageDelivery>> {
    const [result, count] = await this.getStoragesDeliveriesQueryBuilder(req)
      .leftJoin('executorCard.users', 'executorUsers')
      .andWhere('executorUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedStoragesDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<StorageDelivery>> {
    const [result, count] = await this.getStoragesDeliveriesQueryBuilder(req)
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

  async getAllStoragesDeliveries(
    req: Request,
  ): Promise<Response<StorageDelivery>> {
    const [result, count] = await this.getStoragesDeliveriesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createStorageDelivery(
    dto: ExtCreateStorageDeliveryDto & { nick: string },
  ): Promise<void> {
    await this.salesService.checkSaleOwner(dto.saleId, dto.myId, dto.hasRole);
    const delivery = await this.storagesDeliveriesRepository.findOneBy({
      saleId: dto.saleId,
    });
    if (delivery) {
      throw new AppException(StorageDeliveryError.ALREADY_EXISTS);
    }
    const hireId = await this.hiresService.createHire(dto);
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    const storageDelivery = await this.create({ ...dto, stationId: hireId });
    this.mqttService.publishNotificationMessage(
      storageDelivery.id,
      0,
      dto.nick,
      Notification.CREATED_STORAGE_DELIVERY,
    );
  }

  async takeStorageDelivery(
    dto: ExtTakeStorageDeliveryDto & { nick: string },
  ): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    const storageDelivery = await this.storagesDeliveriesRepository.findOne({
      relations: ['hire', 'hire.card'],
      where: { id: dto.storageDeliveryId },
    });
    if (storageDelivery.status !== Status.CREATED) {
      throw new AppException(StorageDeliveryError.NOT_CREATED);
    }
    if (storageDelivery.hire.completedAt < new Date()) {
      throw new AppException(StorageDeliveryError.ALREADY_EXPIRED);
    }
    await this.take(storageDelivery, dto.cardId);
    this.mqttService.publishNotificationMessage(
      dto.storageDeliveryId,
      storageDelivery.hire.card.userId,
      dto.nick,
      Notification.TAKEN_STORAGE_DELIVERY,
    );
  }

  async untakeStorageDelivery(
    dto: ExtStorageDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const storageDelivery = await this.checkStorageDeliveryExecutor(
      dto.storageDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (storageDelivery.status !== Status.TAKEN) {
      throw new AppException(StorageDeliveryError.NOT_TAKEN);
    }
    await this.untake(storageDelivery);
    this.mqttService.publishNotificationMessage(
      dto.storageDeliveryId,
      storageDelivery.hire.card.userId,
      dto.nick,
      Notification.UNTAKEN_STORAGE_DELIVERY,
    );
  }

  async executeStorageDelivery(
    dto: ExtStorageDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const storageDelivery = await this.checkStorageDeliveryExecutor(
      dto.storageDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (storageDelivery.status !== Status.TAKEN) {
      throw new AppException(StorageDeliveryError.NOT_TAKEN);
    }
    await this.execute(storageDelivery);
    this.mqttService.publishNotificationMessage(
      dto.storageDeliveryId,
      storageDelivery.hire.card.userId,
      dto.nick,
      Notification.EXECUTED_STORAGE_DELIVERY,
    );
  }

  async completeStorageDelivery(
    dto: ExtStorageDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const storageDelivery = await this.checkStorageDeliveryCustomer(
      dto.storageDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (storageDelivery.status !== Status.EXECUTED) {
      throw new AppException(StorageDeliveryError.NOT_EXECUTED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: storageDelivery.hire.cardId,
      sum: storageDelivery.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: storageDelivery.hire.cardId,
      receiverCardId: storageDelivery.executorCardId,
      sum: storageDelivery.price,
      description: '',
    });
    await this.hiresService.completeHire({
      ...dto,
      hireId: storageDelivery.hireId,
    });
    await this.complete(storageDelivery);
    this.mqttService.publishNotificationMessage(
      dto.storageDeliveryId,
      storageDelivery.executorCard.userId,
      dto.nick,
      Notification.COMPLETED_STORAGE_DELIVERY,
    );
  }

  async deleteStorageDelivery(
    dto: ExtStorageDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const storageDelivery = await this.checkStorageDeliveryCustomer(
      dto.storageDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (storageDelivery.status !== Status.CREATED) {
      throw new AppException(StorageDeliveryError.NOT_CREATED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: storageDelivery.hire.cardId,
      sum: storageDelivery.price,
    });
    await this.hiresService.completeHire({
      ...dto,
      hireId: storageDelivery.hireId,
    });
    await this.delete(storageDelivery);
  }

  async rateStorageDelivery(
    dto: ExtRateStorageDeliveryDto & { nick: string },
  ): Promise<void> {
    const storageDelivery = await this.checkStorageDeliveryCustomer(
      dto.storageDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (storageDelivery.status !== Status.COMPLETED) {
      throw new AppException(StorageDeliveryError.NOT_COMPLETED);
    }
    await this.rate(storageDelivery, dto.rate);
    this.mqttService.publishNotificationMessage(
      dto.storageDeliveryId,
      storageDelivery.executorCard.userId,
      dto.nick,
      Notification.RATED_STORAGE_DELIVERY,
    );
  }

  async checkStorageDeliveryExists(id: number): Promise<void> {
    await this.storagesDeliveriesRepository.findOneByOrFail({ id });
  }

  private async checkStorageDeliveryCustomer(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<StorageDelivery> {
    const storageDelivery = await this.storagesDeliveriesRepository.findOne({
      relations: ['hire', 'hire.card', 'hire.card.users', 'executorCard'],
      where: { id },
    });
    if (
      !storageDelivery.hire.card.users
        .map((user) => user.id)
        .includes(userId) &&
      !hasRole
    ) {
      throw new AppException(StorageDeliveryError.NOT_CUSTOMER);
    }
    return storageDelivery;
  }

  private async checkStorageDeliveryExecutor(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<StorageDelivery> {
    const storageDelivery = await this.storagesDeliveriesRepository.findOne({
      relations: ['executorCard', 'executorCard.users', 'hire', 'hire.card'],
      where: { id },
    });
    if (
      !storageDelivery.executorCard.users
        .map((user) => user.id)
        .includes(userId) &&
      !hasRole
    ) {
      throw new AppException(StorageDeliveryError.NOT_EXECUTOR);
    }
    return storageDelivery;
  }

  private async create(
    dto: ExtCreateStorageDeliveryDto,
  ): Promise<StorageDelivery> {
    try {
      const storageDelivery = this.storagesDeliveriesRepository.create({
        saleId: dto.saleId,
        hireId: dto.stationId,
        price: dto.price,
      });
      await this.storagesDeliveriesRepository.save(storageDelivery);
      return storageDelivery;
    } catch (error) {
      throw new AppException(StorageDeliveryError.CREATE_FAILED);
    }
  }

  private async take(
    storageDelivery: StorageDelivery,
    cardId: number,
  ): Promise<void> {
    try {
      storageDelivery.executorCardId = cardId;
      storageDelivery.status = Status.TAKEN;
      await this.storagesDeliveriesRepository.save(storageDelivery);
    } catch (error) {
      throw new AppException(StorageDeliveryError.TAKE_FAILED);
    }
  }

  private async untake(storageDelivery: StorageDelivery): Promise<void> {
    try {
      storageDelivery.executorCard = null;
      storageDelivery.executorCardId = null;
      storageDelivery.status = Status.CREATED;
      await this.storagesDeliveriesRepository.save(storageDelivery);
    } catch (error) {
      throw new AppException(StorageDeliveryError.UNTAKE_FAILED);
    }
  }

  private async execute(storageDelivery: StorageDelivery): Promise<void> {
    try {
      storageDelivery.status = Status.EXECUTED;
      await this.storagesDeliveriesRepository.save(storageDelivery);
    } catch (error) {
      throw new AppException(StorageDeliveryError.EXECUTE_FAILED);
    }
  }

  private async complete(storageDelivery: StorageDelivery): Promise<void> {
    try {
      storageDelivery.completedAt = new Date();
      storageDelivery.status = Status.COMPLETED;
      await this.storagesDeliveriesRepository.save(storageDelivery);
    } catch (error) {
      throw new AppException(StorageDeliveryError.COMPLETE_FAILED);
    }
  }

  private async delete(storageDelivery: StorageDelivery): Promise<void> {
    try {
      storageDelivery.completedAt = new Date();
      storageDelivery.status = Status.COMPLETED;
      await this.storagesDeliveriesRepository.save(storageDelivery);
    } catch (error) {
      throw new AppException(StorageDeliveryError.DELETE_FAILED);
    }
  }

  private async rate(
    storageDelivery: StorageDelivery,
    rate: number,
  ): Promise<void> {
    try {
      storageDelivery.rate = rate;
      await this.storagesDeliveriesRepository.save(storageDelivery);
    } catch (error) {
      throw new AppException(StorageDeliveryError.RATE_FAILED);
    }
  }

  private getStoragesDeliveriesQueryBuilder(
    req: Request,
  ): SelectQueryBuilder<StorageDelivery> {
    return this.storagesDeliveriesRepository
      .createQueryBuilder('storageDelivery')
      .innerJoin('storageDelivery.sale', 'sale')
      .innerJoin('sale.product', 'product')
      .innerJoin('product.lease', 'lease')
      .innerJoin('lease.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'fromOwnerCard')
      .innerJoin('fromOwnerCard.user', 'fromOwnerUser')
      .innerJoin('storageDelivery.hire', 'hire')
      .innerJoin('hire.drawer', 'drawer')
      .innerJoin('drawer.station', 'station')
      .innerJoin('station.card', 'toOwnerCard')
      .innerJoin('toOwnerCard.user', 'toOwnerUser')
      .innerJoin('hire.card', 'customerCard')
      .innerJoin('customerCard.user', 'customerUser')
      .leftJoin('storageDelivery.executorCard', 'executorCard')
      .leftJoin('executorCard.user', 'executorUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.id}`)
            .orWhere('storageDelivery.id = :id', { id: req.id }),
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
            .where(`${!req.station}`)
            .orWhere('station.id = :stationId', { stationId: req.station }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.drawer}`)
            .orWhere('drawer.id = :drawerId', { drawerId: req.drawer }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.item}`)
            .orWhere('product.item = :item', { item: req.item }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('product.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.minAmount}`).orWhere('sale.amount >= :minAmount', {
            minAmount: req.minAmount,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxAmount}`).orWhere('sale.amount <= :maxAmount', {
            maxAmount: req.maxAmount,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minIntake}`)
            .orWhere('product.intake >= :minIntake', {
              minIntake: req.minIntake,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxIntake}`)
            .orWhere('product.intake <= :maxIntake', {
              maxIntake: req.maxIntake,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.kit}`)
            .orWhere('product.kit = :kit', { kit: req.kit }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('storageDelivery.price >= :minPrice', {
              minPrice: req.minPrice,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('storageDelivery.price <= :maxPrice', {
              maxPrice: req.maxPrice,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.status}`)
            .orWhere('storageDelivery.status = :status', {
              status: req.status,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('storageDelivery.rate = :rate', { rate: req.rate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('storageDelivery.createdAt >= :minDate', {
              minDate: req.minDate,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('storageDelivery.createdAt <= :maxDate', {
              maxDate: req.maxDate,
            }),
        ),
      )
      .orderBy('storageDelivery.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'storageDelivery.id',
        'sale.id',
        'product.id',
        'lease.id',
        'cell.id',
        'storage.id',
        'fromOwnerCard.id',
        'fromOwnerUser.id',
        'fromOwnerUser.nick',
        'fromOwnerUser.avatar',
        'fromOwnerCard.name',
        'fromOwnerCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
        'product.item',
        'product.description',
        'product.intake',
        'product.kit',
        'sale.amount',
        'hire.id',
        'drawer.id',
        'station.id',
        'toOwnerCard.id',
        'toOwnerUser.id',
        'toOwnerUser.nick',
        'toOwnerUser.avatar',
        'toOwnerCard.name',
        'toOwnerCard.color',
        'station.name',
        'station.x',
        'station.y',
        'drawer.name',
        'customerCard.id',
        'customerUser.id',
        'customerUser.nick',
        'customerUser.avatar',
        'customerCard.name',
        'customerCard.color',
        'storageDelivery.price',
        'storageDelivery.status',
        'storageDelivery.createdAt',
        'executorCard.id',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'executorCard.name',
        'executorCard.color',
        'storageDelivery.completedAt',
        'storageDelivery.rate',
      ]);
  }
}
