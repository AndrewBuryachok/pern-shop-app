import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { ShopDelivery } from './shop-delivery.entity';
import { BargainsService } from '../bargains/bargains.service';
import { HiresService } from '../hires/hires.service';
import { CardsService } from '../cards/cards.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateShopDeliveryDto,
  ExtEditShopDeliveryDto,
  ExtShopDeliveryIdDto,
  ExtRateShopDeliveryDto,
  ExtTakeShopDeliveryDto,
} from './shop-delivery.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { ShopDeliveryError } from './shop-delivery-error.enum';
import { Status } from '../transportations/status.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class ShopsDeliveriesService {
  constructor(
    @InjectRepository(ShopDelivery)
    private shopsDeliveriesRepository: Repository<ShopDelivery>,
    @Inject(forwardRef(() => BargainsService))
    private bargainsService: BargainsService,
    private hiresService: HiresService,
    private cardsService: CardsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainShopsDeliveries(req: Request): Promise<Response<ShopDelivery>> {
    const [result, count] = await this.getShopsDeliveriesQueryBuilder(req)
      .andWhere('shopDelivery.status = :status', {
        status: Status.CREATED,
      })
      .andWhere('hire.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyShopsDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<ShopDelivery>> {
    const [result, count] = await this.getShopsDeliveriesQueryBuilder(req)
      .innerJoin('customerCard.users', 'customerUsers')
      .andWhere('customerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getTakenShopsDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<ShopDelivery>> {
    const [result, count] = await this.getShopsDeliveriesQueryBuilder(req)
      .leftJoin('executorCard.users', 'executorUsers')
      .andWhere('executorUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedShopsDeliveries(
    myId: number,
    req: Request,
  ): Promise<Response<ShopDelivery>> {
    const [result, count] = await this.getShopsDeliveriesQueryBuilder(req)
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

  async getAllShopsDeliveries(req: Request): Promise<Response<ShopDelivery>> {
    const [result, count] = await this.getShopsDeliveriesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createShopDelivery(
    dto: ExtCreateShopDeliveryDto & { nick: string },
  ): Promise<void> {
    await this.bargainsService.checkBargainOwner(
      dto.bargainId,
      dto.myId,
      dto.hasRole,
    );
    const delivery = await this.shopsDeliveriesRepository.findOneBy({
      bargainId: dto.bargainId,
    });
    if (delivery) {
      throw new AppException(ShopDeliveryError.ALREADY_EXISTS);
    }
    const hireId = await this.hiresService.createHire(dto);
    await this.cardsService.decreaseCardBalance({ ...dto, sum: dto.price });
    const shopDelivery = await this.create({ ...dto, stationId: hireId });
    this.mqttService.publishNotificationMessage(
      shopDelivery.id,
      0,
      dto.nick,
      Notification.CREATED_SHOP_DELIVERY,
    );
  }

  async editShopDelivery(dto: ExtEditShopDeliveryDto): Promise<void> {
    const shopDelivery = await this.checkShopDeliveryCustomer(
      dto.shopDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (shopDelivery.status !== Status.CREATED) {
      throw new AppException(ShopDeliveryError.ALREADY_TAKEN);
    }
    if (dto.price !== shopDelivery.price) {
      if (dto.price < shopDelivery.price) {
        await this.cardsService.increaseCardBalance({
          cardId: shopDelivery.hire.cardId,
          sum: shopDelivery.price - dto.price,
        });
      } else {
        await this.cardsService.decreaseCardBalance({
          cardId: shopDelivery.hire.cardId,
          sum: dto.price - shopDelivery.price,
        });
      }
    }
    await this.edit(shopDelivery, dto);
  }

  async takeShopDelivery(
    dto: ExtTakeShopDeliveryDto & { nick: string },
  ): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    const shopDelivery = await this.shopsDeliveriesRepository.findOne({
      relations: ['hire', 'hire.card'],
      where: { id: dto.shopDeliveryId },
    });
    if (shopDelivery.status !== Status.CREATED) {
      throw new AppException(ShopDeliveryError.ALREADY_TAKEN);
    }
    if (shopDelivery.hire.completedAt < new Date()) {
      throw new AppException(ShopDeliveryError.ALREADY_EXPIRED);
    }
    await this.take(shopDelivery, dto.cardId);
    this.mqttService.publishNotificationMessage(
      dto.shopDeliveryId,
      shopDelivery.hire.card.userId,
      dto.nick,
      Notification.TAKEN_SHOP_DELIVERY,
    );
  }

  async untakeShopDelivery(
    dto: ExtShopDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const shopDelivery = await this.checkShopDeliveryExecutor(
      dto.shopDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (shopDelivery.status !== Status.TAKEN) {
      throw new AppException(ShopDeliveryError.NOT_TAKEN);
    }
    await this.untake(shopDelivery);
    this.mqttService.publishNotificationMessage(
      dto.shopDeliveryId,
      shopDelivery.hire.card.userId,
      dto.nick,
      Notification.UNTAKEN_SHOP_DELIVERY,
    );
  }

  async executeShopDelivery(
    dto: ExtShopDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const shopDelivery = await this.checkShopDeliveryExecutor(
      dto.shopDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (shopDelivery.status !== Status.TAKEN) {
      throw new AppException(ShopDeliveryError.NOT_TAKEN);
    }
    await this.execute(shopDelivery);
    this.mqttService.publishNotificationMessage(
      dto.shopDeliveryId,
      shopDelivery.hire.card.userId,
      dto.nick,
      Notification.EXECUTED_SHOP_DELIVERY,
    );
  }

  async completeShopDelivery(
    dto: ExtShopDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const shopDelivery = await this.checkShopDeliveryCustomer(
      dto.shopDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (shopDelivery.status !== Status.EXECUTED) {
      throw new AppException(ShopDeliveryError.NOT_EXECUTED);
    }
    await this.cardsService.increaseCardBalance({
      cardId: shopDelivery.hire.cardId,
      sum: shopDelivery.price,
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: shopDelivery.hire.cardId,
      receiverCardId: shopDelivery.executorCardId,
      sum: shopDelivery.price,
      description: '',
    });
    await this.hiresService.completeHire({
      ...dto,
      hireId: shopDelivery.hireId,
    });
    await this.complete(shopDelivery);
    this.mqttService.publishNotificationMessage(
      dto.shopDeliveryId,
      shopDelivery.executorCard.userId,
      dto.nick,
      Notification.COMPLETED_SHOP_DELIVERY,
    );
  }

  async deleteShopDelivery(
    dto: ExtShopDeliveryIdDto & { nick: string },
  ): Promise<void> {
    const shopDelivery = await this.checkShopDeliveryCustomer(
      dto.shopDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (shopDelivery.status !== Status.CREATED) {
      throw new AppException(ShopDeliveryError.ALREADY_TAKEN);
    }
    await this.cardsService.increaseCardBalance({
      cardId: shopDelivery.hire.cardId,
      sum: shopDelivery.price,
    });
    await this.hiresService.completeHire({
      ...dto,
      hireId: shopDelivery.hireId,
    });
    await this.delete(shopDelivery);
  }

  async rateShopDelivery(
    dto: ExtRateShopDeliveryDto & { nick: string },
  ): Promise<void> {
    const shopDelivery = await this.checkShopDeliveryCustomer(
      dto.shopDeliveryId,
      dto.myId,
      dto.hasRole,
    );
    if (shopDelivery.status !== Status.COMPLETED) {
      throw new AppException(ShopDeliveryError.NOT_COMPLETED);
    }
    await this.rate(shopDelivery, dto.rate);
    this.mqttService.publishNotificationMessage(
      dto.shopDeliveryId,
      shopDelivery.executorCard.userId,
      dto.nick,
      Notification.RATED_SHOP_DELIVERY,
    );
  }

  async checkShopDeliveryExists(id: number): Promise<void> {
    await this.shopsDeliveriesRepository.findOneByOrFail({ id });
  }

  private async checkShopDeliveryCustomer(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<ShopDelivery> {
    const shopDelivery = await this.shopsDeliveriesRepository.findOne({
      relations: ['hire', 'hire.card', 'hire.card.users', 'executorCard'],
      where: { id },
    });
    if (
      !shopDelivery.hire.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(ShopDeliveryError.NOT_CUSTOMER);
    }
    return shopDelivery;
  }

  private async checkShopDeliveryExecutor(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<ShopDelivery> {
    const shopDelivery = await this.shopsDeliveriesRepository.findOne({
      relations: ['executorCard', 'executorCard.users', 'hire', 'hire.card'],
      where: { id },
    });
    if (
      !shopDelivery.executorCard.users
        .map((user) => user.id)
        .includes(userId) &&
      !hasRole
    ) {
      throw new AppException(ShopDeliveryError.NOT_EXECUTOR);
    }
    return shopDelivery;
  }

  private async create(dto: ExtCreateShopDeliveryDto): Promise<ShopDelivery> {
    try {
      const shopDelivery = this.shopsDeliveriesRepository.create({
        bargainId: dto.bargainId,
        hireId: dto.stationId,
        price: dto.price,
      });
      await this.shopsDeliveriesRepository.save(shopDelivery);
      return shopDelivery;
    } catch (error) {
      throw new AppException(ShopDeliveryError.CREATE_FAILED);
    }
  }

  private async edit(
    shopDelivery: ShopDelivery,
    dto: ExtEditShopDeliveryDto,
  ): Promise<void> {
    try {
      shopDelivery.price = dto.price;
      await this.shopsDeliveriesRepository.save(shopDelivery);
    } catch (error) {
      throw new AppException(ShopDeliveryError.EDIT_FAILED);
    }
  }

  private async take(
    shopDelivery: ShopDelivery,
    cardId: number,
  ): Promise<void> {
    try {
      shopDelivery.executorCardId = cardId;
      shopDelivery.status = Status.TAKEN;
      await this.shopsDeliveriesRepository.save(shopDelivery);
    } catch (error) {
      throw new AppException(ShopDeliveryError.TAKE_FAILED);
    }
  }

  private async untake(shopDelivery: ShopDelivery): Promise<void> {
    try {
      shopDelivery.executorCard = null;
      shopDelivery.executorCardId = null;
      shopDelivery.status = Status.CREATED;
      await this.shopsDeliveriesRepository.save(shopDelivery);
    } catch (error) {
      throw new AppException(ShopDeliveryError.UNTAKE_FAILED);
    }
  }

  private async execute(shopDelivery: ShopDelivery): Promise<void> {
    try {
      shopDelivery.status = Status.EXECUTED;
      await this.shopsDeliveriesRepository.save(shopDelivery);
    } catch (error) {
      throw new AppException(ShopDeliveryError.EXECUTE_FAILED);
    }
  }

  private async complete(shopDelivery: ShopDelivery): Promise<void> {
    try {
      shopDelivery.completedAt = new Date();
      shopDelivery.status = Status.COMPLETED;
      await this.shopsDeliveriesRepository.save(shopDelivery);
    } catch (error) {
      throw new AppException(ShopDeliveryError.COMPLETE_FAILED);
    }
  }

  private async delete(shopDelivery: ShopDelivery): Promise<void> {
    try {
      await this.shopsDeliveriesRepository.remove(shopDelivery);
    } catch (error) {
      throw new AppException(ShopDeliveryError.DELETE_FAILED);
    }
  }

  private async rate(shopDelivery: ShopDelivery, rate: number): Promise<void> {
    try {
      shopDelivery.rate = rate;
      await this.shopsDeliveriesRepository.save(shopDelivery);
    } catch (error) {
      throw new AppException(ShopDeliveryError.RATE_FAILED);
    }
  }

  private getShopsDeliveriesQueryBuilder(
    req: Request,
  ): SelectQueryBuilder<ShopDelivery> {
    return this.shopsDeliveriesRepository
      .createQueryBuilder('shopDelivery')
      .innerJoin('shopDelivery.bargain', 'bargain')
      .innerJoin('bargain.good', 'good')
      .innerJoin('good.shop', 'shop')
      .innerJoin('shop.card', 'fromOwnerCard')
      .innerJoin('fromOwnerCard.user', 'fromOwnerUser')
      .innerJoin('shopDelivery.hire', 'hire')
      .innerJoin('hire.drawer', 'drawer')
      .innerJoin('drawer.station', 'station')
      .innerJoin('station.card', 'toOwnerCard')
      .innerJoin('toOwnerCard.user', 'toOwnerUser')
      .innerJoin('hire.card', 'customerCard')
      .innerJoin('customerCard.user', 'customerUser')
      .leftJoin('shopDelivery.executorCard', 'executorCard')
      .leftJoin('executorCard.user', 'executorUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.id}`)
            .orWhere('shopDelivery.id = :id', { id: req.id }),
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
            .where(`${!req.drawer}`)
            .orWhere('drawer.id = :drawerId', { drawerId: req.drawer }),
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
            .orWhere('bargain.amount >= :minAmount', {
              minAmount: req.minAmount,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxAmount}`)
            .orWhere('bargain.amount <= :maxAmount', {
              maxAmount: req.maxAmount,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.minIntake}`).orWhere('good.intake >= :minIntake', {
            minIntake: req.minIntake,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxIntake}`).orWhere('good.intake <= :maxIntake', {
            maxIntake: req.maxIntake,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.kit}`).orWhere('good.kit = :kit', { kit: req.kit }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('shopDelivery.price >= :minPrice', {
              minPrice: req.minPrice,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('shopDelivery.price <= :maxPrice', {
              maxPrice: req.maxPrice,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.status}`)
            .orWhere('shopDelivery.status = :status', { status: req.status }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('shopDelivery.rate = :rate', { rate: req.rate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('shopDelivery.createdAt >= :minDate', {
              minDate: req.minDate,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('shopDelivery.createdAt <= :maxDate', {
              maxDate: req.maxDate,
            }),
        ),
      )
      .orderBy('shopDelivery.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'shopDelivery.id',
        'bargain.id',
        'good.id',
        'shop.id',
        'fromOwnerCard.id',
        'fromOwnerUser.id',
        'fromOwnerUser.nick',
        'fromOwnerUser.avatar',
        'fromOwnerCard.name',
        'fromOwnerCard.color',
        'shop.name',
        'shop.x',
        'shop.y',
        'good.item',
        'good.description',
        'good.intake',
        'good.kit',
        'bargain.amount',
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
        'shopDelivery.price',
        'shopDelivery.status',
        'executorCard.id',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
        'executorCard.name',
        'executorCard.color',
        'shopDelivery.createdAt',
        'shopDelivery.completedAt',
        'shopDelivery.rate',
      ]);
  }
}
