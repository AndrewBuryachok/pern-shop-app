import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Delivery } from './delivery.entity';
import { LeasesService } from '../leases/leases.service';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import {
  ExtCreateDeliveryDto,
  ExtDeliveryIdDto,
  ExtTakeDeliveryDto,
} from './delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { DeliveryError } from './delivery-error.enum';
import { TransportationStatus } from '../transportations/transportation-status.enum';
import { Filter, Mode } from '../../common/enums';

@Injectable()
export class DeliveriesService {
  constructor(
    @InjectRepository(Delivery)
    private deliveriesRepository: Repository<Delivery>,
    private leasesService: LeasesService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
  ) {}

  async getMainDeliveries(req: Request): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(req)
      .andWhere('delivery.executorCard IS NULL')
      .andWhere('delivery.createdAt > :date', { date: getDateWeekAgo() })
      .getManyAndCount();
    return { result, count };
  }

  async getMyDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb.where('senderUser.id = :myId').orWhere('receiverUser.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getTakenDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(req)
      .andWhere('executorUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<Delivery>> {
    const [result, count] = await this.getDeliveriesQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('fromOwnerUser.id = :myId')
            .orWhere('toOwnerUser.id = :myId'),
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
    });
    const toLeaseId = await this.leasesService.createLease({
      ...dto,
      storageId: dto.toStorageId,
    });
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    await this.create({
      ...dto,
      fromStorageId: fromLeaseId,
      toStorageId: toLeaseId,
    });
  }

  async takeDelivery(dto: ExtTakeDeliveryDto): Promise<void> {
    await this.cardsService.checkCardOwner(dto.cardId, dto.myId);
    const delivery = await this.deliveriesRepository.findOneBy({
      id: dto.deliveryId,
    });
    if (delivery.createdAt < getDateWeekAgo()) {
      throw new AppException(DeliveryError.ALREADY_EXPIRED);
    }
    if (delivery.executorCardId) {
      throw new AppException(DeliveryError.ALREADY_TAKEN);
    }
    await this.take(delivery, dto.cardId);
  }

  async untakeDelivery(dto: ExtDeliveryIdDto): Promise<void> {
    const delivery = await this.checkDeliveryExecutor(dto.deliveryId, dto.myId);
    if (delivery.status !== TransportationStatus.TAKEN) {
      throw new AppException(DeliveryError.ALREADY_EXECUTED);
    }
    await this.untake(delivery);
  }

  async executeDelivery(dto: ExtDeliveryIdDto): Promise<void> {
    const delivery = await this.checkDeliveryExecutor(dto.deliveryId, dto.myId);
    if (delivery.status !== TransportationStatus.TAKEN) {
      throw new AppException(DeliveryError.ALREADY_EXECUTED);
    }
    await this.execute(delivery);
  }

  async completeDelivery(dto: ExtDeliveryIdDto): Promise<void> {
    const delivery = await this.checkDeliveryReceiver(dto.deliveryId, dto.myId);
    if (delivery.completedAt) {
      throw new AppException(DeliveryError.ALREADY_COMPLETED);
    }
    if (delivery.status !== TransportationStatus.EXECUTED) {
      throw new AppException(DeliveryError.NOT_EXECUTED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: delivery.fromLease.cardId,
      sum: delivery.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      senderCardId: delivery.fromLease.cardId,
      receiverCardId: delivery.executorCardId,
      sum: delivery.price,
      description: 'complete delivery',
    });
    await this.complete(delivery);
  }

  async deleteDelivery(dto: ExtDeliveryIdDto): Promise<void> {
    const delivery = await this.checkDeliverySender(dto.deliveryId, dto.myId);
    if (delivery.executorCardId) {
      throw new AppException(DeliveryError.ALREADY_TAKEN);
    }
    await this.cardsService.increaseCardBalance({
      cardId: delivery.fromLease.cardId,
      sum: delivery.price,
    });
    await this.delete(delivery);
  }

  async checkDeliveryExists(id: number): Promise<void> {
    await this.deliveriesRepository.findOneByOrFail({ id });
  }

  private async checkDeliverySender(
    id: number,
    userId: number,
  ): Promise<Delivery> {
    const delivery = await this.deliveriesRepository.findOne({
      relations: ['fromLease'],
      where: { id, fromLease: { card: { userId } } },
    });
    if (!delivery) {
      throw new AppException(DeliveryError.NOT_SENDER);
    }
    return delivery;
  }

  private async checkDeliveryReceiver(
    id: number,
    userId: number,
  ): Promise<Delivery> {
    const delivery = await this.deliveriesRepository.findOne({
      relations: ['fromLease'],
      where: { id, receiverUserId: userId },
    });
    if (!delivery) {
      throw new AppException(DeliveryError.NOT_RECEIVER);
    }
    return delivery;
  }

  private async checkDeliveryExecutor(
    id: number,
    userId: number,
  ): Promise<Delivery> {
    const delivery = await this.deliveriesRepository.findOneBy({
      id,
      executorCard: { userId },
    });
    if (!delivery) {
      throw new AppException(DeliveryError.NOT_EXECUTOR);
    }
    return delivery;
  }

  private async create(dto: ExtCreateDeliveryDto): Promise<void> {
    try {
      const delivery = this.deliveriesRepository.create({
        fromLeaseId: dto.fromStorageId,
        toLeaseId: dto.toStorageId,
        receiverUserId: dto.userId,
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
      delivery.status = TransportationStatus.TAKEN;
      await this.deliveriesRepository.save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.TAKE_FAILED);
    }
  }

  private async untake(delivery: Delivery): Promise<void> {
    try {
      delivery.executorCardId = null;
      delivery.status = TransportationStatus.CREATED;
      await this.deliveriesRepository.save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.UNTAKE_FAILED);
    }
  }

  private async execute(delivery: Delivery): Promise<void> {
    try {
      delivery.status = TransportationStatus.EXECUTED;
      await this.deliveriesRepository.save(delivery);
    } catch (error) {
      throw new AppException(DeliveryError.EXECUTE_FAILED);
    }
  }

  private async complete(delivery: Delivery): Promise<void> {
    try {
      delivery.completedAt = new Date();
      delivery.status = TransportationStatus.COMPLETED;
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
      .innerJoin('fromLease.card', 'senderCard')
      .innerJoin('senderCard.user', 'senderUser')
      .innerJoin('delivery.receiverUser', 'receiverUser')
      .leftJoin('delivery.executorCard', 'executorCard')
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
                            .where(`${req.filters.includes(Filter.SENDER)}`)
                            .andWhere('senderUser.id = :userId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.RECEIVER)}`)
                            .andWhere('receiverUser.id = :userId'),
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
                            .andWhere('fromOwnerUser.id = :userId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.OWNER)}`)
                            .andWhere('toOwnerUser.id = :userId'),
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
                        .where(`${!req.filters.includes(Filter.SENDER)}`)
                        .orWhere('senderUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.RECEIVER)}`)
                        .orWhere('receiverUser.id = :userId'),
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
                        .orWhere('fromOwnerUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.OWNER)}`)
                        .orWhere('toOwnerUser.id = :userId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `senderUser.id ${
                      req.filters.includes(Filter.SENDER) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `receiverUser.id ${
                      req.filters.includes(Filter.RECEIVER) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `executorUser.id ${
                      req.filters.includes(Filter.EXECUTOR) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `fromOwnerUser.id ${
                      req.filters.includes(Filter.OWNER) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `toOwnerUser.id ${
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
                            .where(`${req.filters.includes(Filter.SENDER)}`)
                            .andWhere('senderCard.id = :cardId'),
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
                            .andWhere('fromOwnerCard.id = :cardId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.OWNER)}`)
                            .andWhere('toOwnerCard.id = :cardId'),
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
                        .where(`${!req.filters.includes(Filter.SENDER)}`)
                        .orWhere('senderCard.id = :cardId'),
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
                        .orWhere('fromOwnerCard.id = :cardId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.OWNER)}`)
                        .orWhere('toOwnerCard.id = :cardId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `senderCard.id ${
                      req.filters.includes(Filter.SENDER) ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `executorCard.id ${
                      req.filters.includes(Filter.EXECUTOR) ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `fromOwnerCard.id ${
                      req.filters.includes(Filter.OWNER) ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `toOwnerCard.id ${
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
        'fromOwnerUser.name',
        'fromOwnerUser.status',
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
        'toOwnerUser.name',
        'toOwnerUser.status',
        'toOwnerCard.name',
        'toOwnerCard.color',
        'toStorage.name',
        'toStorage.x',
        'toStorage.y',
        'toCell.name',
        'senderCard.id',
        'senderUser.id',
        'senderUser.name',
        'senderUser.status',
        'senderCard.name',
        'senderCard.color',
        'receiverUser.id',
        'receiverUser.name',
        'receiverUser.status',
        'delivery.item',
        'delivery.description',
        'delivery.amount',
        'delivery.intake',
        'delivery.kit',
        'delivery.price',
        'delivery.createdAt',
        'executorCard.id',
        'executorUser.id',
        'executorUser.name',
        'executorUser.status',
        'executorCard.name',
        'executorCard.color',
        'delivery.completedAt',
        'delivery.status',
      ]);
  }
}
