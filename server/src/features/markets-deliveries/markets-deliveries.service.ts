import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { MarketDelivery } from './market-delivery.entity';
import { TradesService } from '../trades/trades.service';
import { HiresService } from '../hires/hires.service';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateMarketDeliveryDto,
  ExtEditMarketDeliveryDto,
  ExtMarketDeliveryIdDto,
  ExtRateMarketDeliveryDto,
  ExtTakeMarketDeliveryDto,
} from './market-delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { MarketDeliveryError } from './market-delivery-error.enum';
import { Status } from '../transportations/status.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class MarketsDeliveriesService {
  constructor(
    @InjectRepository(MarketDelivery)
    private marketsDeliveriesRepository: Repository<MarketDelivery>,
    @Inject(forwardRef(() => TradesService))
    private tradesService: TradesService,
    private hiresService: HiresService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainMarketsDeliveries(
    req: Request,
  ): Promise<Response<MarketDelivery>> {
    const [result, count] = await this.getMarketsDeliveriesQueryBuilder(req)
      .andWhere('marketDelivery.status = :status', {
        status: Status.CREATED,
      })
      .andWhere('hire.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyMarketsDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<MarketDelivery>> {
    const [result, count] = await this.getMarketsDeliveriesQueryBuilder(req)
      .innerJoin('customerCard.users', 'customerUsers')
      .andWhere('customerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getTakenMarketsDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<MarketDelivery>> {
    const [result, count] = await this.getMarketsDeliveriesQueryBuilder(req)
      .leftJoin('executorCard.users', 'executorUsers')
      .andWhere('executorUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedMarketsDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<MarketDelivery>> {
    const [result, count] = await this.getMarketsDeliveriesQueryBuilder(req)
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

  async getAllMarketsDeliveries(
    req: Request,
  ): Promise<Response<MarketDelivery>> {
    const [result, count] = await this.getMarketsDeliveriesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createMarketDelivery(
    dto: ExtCreateMarketDeliveryDto & { nick: string },
  ): Promise<void> {
    await this.tradesService.checkTradeOwner(
      dto.tradeId,
      dto.myId,
      dto.hasRole,
    );
    const delivery = await this.marketsDeliveriesRepository.findOneBy({
      tradeId: dto.tradeId,
    });
    if (delivery) {
      throw new AppException(MarketDeliveryError.ALREADY_EXISTS);
    }
    const hireId = await this.hiresService.createHire(dto);
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    const marketDelivery = await this.create({ ...dto, stationId: hireId });
    this.mqttService.publishNotificationMessage(
      marketDelivery.id,
      0,
      dto.nick,
      Notification.CREATED_MARKET_DELIVERY,
    );
  }

  async editMarketDelivery(dto: ExtEditMarketDeliveryDto): Promise<void> {
    const marketDelivery = await this.checkMarketDeliveryCustomer(
      dto.marketDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (marketDelivery.status !== Status.CREATED) {
      throw new AppException(MarketDeliveryError.NOT_CREATED);
    }
    if (dto.price !== marketDelivery.price) {
      if (dto.price < marketDelivery.price) {
        await this.cardsService.increaseCardBalance({
          cardId: marketDelivery.hire.cardId,
          sum: marketDelivery.price - dto.price,
        });
      } else {
        await this.cardsService.decreaseCardBalance({
          cardId: marketDelivery.hire.cardId,
          sum: dto.price - marketDelivery.price,
        });
      }
    }
    await this.edit(marketDelivery, dto);
  }

  async takeMarketDelivery(
    dto: ExtTakeMarketDeliveryDto & { nick: string },
  ): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    const marketDelivery = await this.marketsDeliveriesRepository.findOne({
      relations: ['hire', 'hire.card'],
      where: { id: dto.marketDeliveryId },
    });
    if (marketDelivery.status !== Status.CREATED) {
      throw new AppException(MarketDeliveryError.NOT_CREATED);
    }
    if (marketDelivery.hire.completedAt < new Date()) {
      throw new AppException(MarketDeliveryError.ALREADY_EXPIRED);
    }
    await this.take(marketDelivery, dto.cardId);
    this.mqttService.publishNotificationMessage(
      dto.marketDeliveryId,
      marketDelivery.hire.card.userId,
      dto.nick,
      Notification.TAKEN_MARKET_DELIVERY,
    );
  }

  async untakeMarketDelivery(
    dto: ExtMarketDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const marketDelivery = await this.checkMarketDeliveryExecutor(
      dto.marketDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (marketDelivery.status !== Status.TAKEN) {
      throw new AppException(MarketDeliveryError.NOT_TAKEN);
    }
    await this.untake(marketDelivery);
    this.mqttService.publishNotificationMessage(
      dto.marketDeliveryId,
      marketDelivery.hire.card.userId,
      dto.nick,
      Notification.UNTAKEN_MARKET_DELIVERY,
    );
  }

  async executeMarketDelivery(
    dto: ExtMarketDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const marketDelivery = await this.checkMarketDeliveryExecutor(
      dto.marketDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (marketDelivery.status !== Status.TAKEN) {
      throw new AppException(MarketDeliveryError.NOT_TAKEN);
    }
    await this.execute(marketDelivery);
    this.mqttService.publishNotificationMessage(
      dto.marketDeliveryId,
      marketDelivery.hire.card.userId,
      dto.nick,
      Notification.EXECUTED_MARKET_DELIVERY,
    );
  }

  async completeMarketDelivery(
    dto: ExtMarketDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const marketDelivery = await this.checkMarketDeliveryCustomer(
      dto.marketDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (marketDelivery.status !== Status.EXECUTED) {
      throw new AppException(MarketDeliveryError.NOT_EXECUTED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: marketDelivery.hire.cardId,
      sum: marketDelivery.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: marketDelivery.hire.cardId,
      receiverCardId: marketDelivery.executorCardId,
      sum: marketDelivery.price,
      description: '',
    });
    await this.hiresService.completeHire({
      ...dto,
      hireId: marketDelivery.hireId,
    });
    await this.complete(marketDelivery);
    this.mqttService.publishNotificationMessage(
      dto.marketDeliveryId,
      marketDelivery.executorCard.userId,
      dto.nick,
      Notification.COMPLETED_MARKET_DELIVERY,
    );
  }

  async deleteMarketDelivery(
    dto: ExtMarketDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const marketDelivery = await this.checkMarketDeliveryCustomer(
      dto.marketDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (marketDelivery.status !== Status.CREATED) {
      throw new AppException(MarketDeliveryError.NOT_CREATED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: marketDelivery.hire.cardId,
      sum: marketDelivery.price,
    });
    await this.hiresService.completeHire({
      ...dto,
      hireId: marketDelivery.hireId,
    });
    await this.delete(marketDelivery);
  }

  async rateMarketDelivery(
    dto: ExtRateMarketDeliveryDto & { nick: string },
  ): Promise<void> {
    const marketDelivery = await this.checkMarketDeliveryCustomer(
      dto.marketDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (marketDelivery.status !== Status.COMPLETED) {
      throw new AppException(MarketDeliveryError.NOT_COMPLETED);
    }
    await this.rate(marketDelivery, dto.rate);
    this.mqttService.publishNotificationMessage(
      dto.marketDeliveryId,
      marketDelivery.executorCard.userId,
      dto.nick,
      Notification.RATED_MARKET_DELIVERY,
    );
  }

  async checkMarketDeliveryExists(id: number): Promise<void> {
    await this.marketsDeliveriesRepository.findOneByOrFail({ id });
  }

  private async checkMarketDeliveryCustomer(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<MarketDelivery> {
    const marketDelivery = await this.marketsDeliveriesRepository.findOne({
      relations: ['hire', 'hire.card', 'hire.card.users', 'executorCard'],
      where: { id },
    });
    if (
      !marketDelivery.hire.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(MarketDeliveryError.NOT_CUSTOMER);
    }
    return marketDelivery;
  }

  private async checkMarketDeliveryExecutor(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<MarketDelivery> {
    const marketDelivery = await this.marketsDeliveriesRepository.findOne({
      relations: ['executorCard', 'executorCard.users', 'hire', 'hire.card'],
      where: { id },
    });
    if (
      !marketDelivery.executorCard.users
        .map((user) => user.id)
        .includes(userId) &&
      !hasRole
    ) {
      throw new AppException(MarketDeliveryError.NOT_EXECUTOR);
    }
    return marketDelivery;
  }

  private async create(
    dto: ExtCreateMarketDeliveryDto,
  ): Promise<MarketDelivery> {
    try {
      const marketDelivery = this.marketsDeliveriesRepository.create({
        tradeId: dto.tradeId,
        hireId: dto.stationId,
        price: dto.price,
      });
      await this.marketsDeliveriesRepository.save(marketDelivery);
      return marketDelivery;
    } catch (error) {
      throw new AppException(MarketDeliveryError.CREATE_FAILED);
    }
  }

  private async edit(
    marketDelivery: MarketDelivery,
    dto: ExtEditMarketDeliveryDto,
  ): Promise<void> {
    try {
      marketDelivery.price = dto.price;
      await this.marketsDeliveriesRepository.save(marketDelivery);
    } catch (error) {
      throw new AppException(MarketDeliveryError.EDIT_FAILED);
    }
  }

  private async take(
    marketDelivery: MarketDelivery,
    cardId: number,
  ): Promise<void> {
    try {
      marketDelivery.executorCardId = cardId;
      marketDelivery.status = Status.TAKEN;
      await this.marketsDeliveriesRepository.save(marketDelivery);
    } catch (error) {
      throw new AppException(MarketDeliveryError.TAKE_FAILED);
    }
  }

  private async untake(marketDelivery: MarketDelivery): Promise<void> {
    try {
      marketDelivery.executorCard = null;
      marketDelivery.executorCardId = null;
      marketDelivery.status = Status.CREATED;
      await this.marketsDeliveriesRepository.save(marketDelivery);
    } catch (error) {
      throw new AppException(MarketDeliveryError.UNTAKE_FAILED);
    }
  }

  private async execute(marketDelivery: MarketDelivery): Promise<void> {
    try {
      marketDelivery.status = Status.EXECUTED;
      await this.marketsDeliveriesRepository.save(marketDelivery);
    } catch (error) {
      throw new AppException(MarketDeliveryError.EXECUTE_FAILED);
    }
  }

  private async complete(marketDelivery: MarketDelivery): Promise<void> {
    try {
      marketDelivery.completedAt = new Date();
      marketDelivery.status = Status.COMPLETED;
      await this.marketsDeliveriesRepository.save(marketDelivery);
    } catch (error) {
      throw new AppException(MarketDeliveryError.COMPLETE_FAILED);
    }
  }

  private async delete(marketDelivery: MarketDelivery): Promise<void> {
    try {
      marketDelivery.completedAt = new Date();
      marketDelivery.status = Status.COMPLETED;
      await this.marketsDeliveriesRepository.save(marketDelivery);
    } catch (error) {
      throw new AppException(MarketDeliveryError.DELETE_FAILED);
    }
  }

  private async rate(
    marketDelivery: MarketDelivery,
    rate: number,
  ): Promise<void> {
    try {
      marketDelivery.rate = rate;
      await this.marketsDeliveriesRepository.save(marketDelivery);
    } catch (error) {
      throw new AppException(MarketDeliveryError.RATE_FAILED);
    }
  }

  private getMarketsDeliveriesQueryBuilder(
    req: Request,
  ): SelectQueryBuilder<MarketDelivery> {
    return this.marketsDeliveriesRepository
      .createQueryBuilder('marketDelivery')
      .innerJoin('marketDelivery.trade', 'trade')
      .innerJoin('trade.ware', 'ware')
      .innerJoin('ware.rent', 'rent')
      .innerJoin('rent.store', 'store')
      .innerJoin('store.market', 'market')
      .innerJoin('market.card', 'fromOwnerCard')
      .innerJoin('fromOwnerCard.user', 'fromOwnerUser')
      .innerJoin('marketDelivery.hire', 'hire')
      .innerJoin('hire.drawer', 'drawer')
      .innerJoin('drawer.station', 'station')
      .innerJoin('station.card', 'toOwnerCard')
      .innerJoin('toOwnerCard.user', 'toOwnerUser')
      .innerJoin('hire.card', 'customerCard')
      .innerJoin('customerCard.user', 'customerUser')
      .leftJoin('marketDelivery.executorCard', 'executorCard')
      .leftJoin('executorCard.user', 'executorUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.id}`)
            .orWhere('marketDelivery.id = :id', { id: req.id }),
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
            .where(`${!req.market}`)
            .orWhere('market.id = :marketId', { marketId: req.market }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.store}`)
            .orWhere('store.id = :storeId', { storeId: req.store }),
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
            .orWhere('ware.item = :item', { item: req.item }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('ware.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.minAmount}`).orWhere('trade.amount >= :minAmount', {
            minAmount: req.minAmount,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxAmount}`).orWhere('trade.amount <= :maxAmount', {
            maxAmount: req.maxAmount,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.minIntake}`).orWhere('ware.intake >= :minIntake', {
            minIntake: req.minIntake,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxIntake}`).orWhere('ware.intake <= :maxIntake', {
            maxIntake: req.maxIntake,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.kit}`).orWhere('ware.kit = :kit', { kit: req.kit }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('marketDelivery.price >= :minPrice', {
              minPrice: req.minPrice,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('marketDelivery.price <= :maxPrice', {
              maxPrice: req.maxPrice,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.status}`)
            .orWhere('marketDelivery.status = :status', { status: req.status }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('marketDelivery.rate = :rate', { rate: req.rate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('marketDelivery.createdAt >= :minDate', {
              minDate: req.minDate,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('marketDelivery.createdAt <= :maxDate', {
              maxDate: req.maxDate,
            }),
        ),
      )
      .orderBy('marketDelivery.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'marketDelivery.id',
        'trade.id',
        'ware.id',
        'rent.id',
        'store.id',
        'market.id',
        'fromOwnerCard.id',
        'fromOwnerUser.id',
        'fromOwnerUser.nick',
        'fromOwnerUser.avatar',
        'fromOwnerCard.name',
        'fromOwnerCard.color',
        'market.name',
        'market.x',
        'market.y',
        'store.name',
        'ware.item',
        'ware.description',
        'ware.intake',
        'ware.kit',
        'trade.amount',
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
        'marketDelivery.price',
        'marketDelivery.status',
        'marketDelivery.createdAt',
        'executorCard.id',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'executorCard.name',
        'executorCard.color',
        'marketDelivery.completedAt',
        'marketDelivery.rate',
      ]);
  }
}
