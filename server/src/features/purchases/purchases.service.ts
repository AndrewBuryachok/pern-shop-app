import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Purchase } from './purchase.entity';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { GoodsService } from '../goods/goods.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreatePurchaseDto,
  ExtRatePurchaseDto,
  PurchaseIdDto,
} from './purchase.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { PurchaseError } from './purchase-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private purchasesRepository: Repository<Purchase>,
    @Inject(forwardRef(() => DeliveriesService))
    private deliveriesService: DeliveriesService,
    private goodsService: GoodsService,
    private mqttService: MqttService,
  ) {}

  async getMyPurchases(
    myId: number,
    req: Request,
  ): Promise<Response<Purchase>> {
    const [result, count] = await this.getPurchasesQueryBuilder(req)
      .innerJoin('buyerCard.users', 'buyerUsers')
      .andWhere('buyerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getSoldPurchases(
    myId: number,
    req: Request,
  ): Promise<Response<Purchase>> {
    const [result, count] = await this.getPurchasesQueryBuilder(req)
      .leftJoin('shopCard.users', 'shopUsers')
      .leftJoin('marketSellerCard.users', 'marketUsers')
      .leftJoin('storageSellerCard.users', 'storageUsers')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('shopUsers.id = :myId')
            .orWhere('marketUsers.id = :myId')
            .orWhere('storageUsers.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedPurchases(
    myId: number,
    req: Request,
  ): Promise<Response<Purchase>> {
    const [result, count] = await this.getPurchasesQueryBuilder(req)
      .leftJoin('shopCard.users', 'shopUsers')
      .leftJoin('marketOwnerCard.users', 'marketUsers')
      .leftJoin('storageOwnerCard.users', 'storageUsers')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('shopUsers.id = :myId')
            .orWhere('marketUsers.id = :myId')
            .orWhere('storageUsers.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllPurchases(req: Request): Promise<Response<Purchase>> {
    const [result, count] = await this.getPurchasesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectUserPurchases(userId: number): Promise<Purchase[]> {
    return this.selectPurchasesQueryBuilder()
      .innerJoin('purchase.card', 'card')
      .leftJoin('card.users', 'users')
      .leftJoinAndMapOne('delivery', 'purchase.deliveries', 'delivery')
      .where('users.id = :userId', { userId })
      .andWhere('delivery.id IS NULL')
      .getMany();
  }

  async createPurchase(
    dto: ExtCreatePurchaseDto & { nick: string },
  ): Promise<void> {
    const good = await this.goodsService.buyGood(dto);
    const purchase = await this.create(dto);
    this.mqttService.publishNotification(
      purchase.id,
      good.shop?.card.userId ||
        good.rent?.card.userId ||
        good.lease?.card.userId,
      dto.nick,
      Notification.CREATED_PURCHASE,
    );
    if (dto.stationId && dto.price) {
      await this.deliveriesService.createDelivery({
        ...dto,
        purchaseId: purchase.id,
      });
    }
  }

  async ratePurchase(
    dto: ExtRatePurchaseDto & { nick: string },
  ): Promise<void> {
    const purchase = await this.checkPurchaseOwner(
      dto.purchaseId,
      dto.myId,
      dto.hasRole,
    );
    await this.rate(purchase, dto.rate);
    this.mqttService.publishNotification(
      dto.purchaseId,
      purchase.good.shop?.card.userId ||
        purchase.good.rent?.card.userId ||
        purchase.good.lease?.card.userId,
      dto.nick,
      Notification.RATED_PURCHASE,
    );
  }

  async deletePurchase(dto: PurchaseIdDto): Promise<void> {
    const purchase = await this.purchasesRepository.findOneBy({
      id: dto.purchaseId,
    });
    await this.delete(purchase);
  }

  async checkPurchaseExists(id: number): Promise<void> {
    await this.purchasesRepository.findOneByOrFail({ id });
  }

  async checkPurchaseOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Purchase> {
    const purchase = await this.purchasesRepository.findOne({
      relations: [
        'card',
        'card.users',
        'good',
        'good.shop',
        'good.shop.card',
        'good.rent',
        'good.rent.card',
        'good.lease',
        'good.lease.card',
      ],
      where: { id },
    });
    if (
      !purchase.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(PurchaseError.NOT_OWNER);
    }
    return purchase;
  }

  private async create(dto: ExtCreatePurchaseDto): Promise<Purchase> {
    try {
      const purchase = this.purchasesRepository.create({
        goodId: dto.goodId,
        cardId: dto.cardId,
        amount: dto.amount,
      });
      await this.purchasesRepository.save(purchase);
      return purchase;
    } catch (error) {
      throw new AppException(PurchaseError.CREATE_FAILED);
    }
  }

  private async rate(purchase: Purchase, rate: number): Promise<void> {
    try {
      purchase.rate = rate;
      await this.purchasesRepository.save(purchase);
    } catch (error) {
      throw new AppException(PurchaseError.RATE_FAILED);
    }
  }

  private async delete(purchase: Purchase): Promise<void> {
    try {
      await this.purchasesRepository.remove(purchase);
    } catch (error) {
      throw new AppException(PurchaseError.DELETE_FAILED);
    }
  }

  private selectPurchasesQueryBuilder(): SelectQueryBuilder<Purchase> {
    return this.purchasesRepository
      .createQueryBuilder('purchase')
      .innerJoin('purchase.good', 'good')
      .leftJoin('good.states', 'state', 'state.createdAt < purchase.createdAt')
      .leftJoin(
        'good.states',
        'next',
        'state.createdAt < next.createdAt AND next.createdAt < purchase.createdAt',
      )
      .where('goodNext.id IS NULL')
      .orderBy('purchase.id', 'DESC')
      .select([
        'purchase.id',
        'good.id',
        'good.item',
        'good.description',
        'good.intake',
        'good.kit',
        'state.price',
        'purchase.amount',
      ]);
  }

  private getPurchasesQueryBuilder(req: Request): SelectQueryBuilder<Purchase> {
    return this.purchasesRepository
      .createQueryBuilder('purchase')
      .innerJoin('purchase.good', 'good')
      .leftJoin('good.shop', 'shop')
      .leftJoin('shop.card', 'shopCard')
      .leftJoin('shopCard.user', 'shopUser')
      .leftJoin('good.rent', 'rent')
      .leftJoin('rent.stall', 'stall')
      .leftJoin('stall.market', 'market')
      .leftJoin('market.card', 'marketOwnerCard')
      .leftJoin('marketOwnerCard.user', 'marketOwnerUser')
      .leftJoin('rent.card', 'marketSellerCard')
      .leftJoin('marketSellerCard.user', 'marketSellerUser')
      .leftJoin('good.lease', 'lease')
      .leftJoin('lease.cell', 'cell')
      .leftJoin('cell.storage', 'storage')
      .leftJoin('storage.card', 'storageOwnerCard')
      .leftJoin('storageOwnerCard.user', 'storageOwnerUser')
      .leftJoin('lease.card', 'storageSellerCard')
      .leftJoin('storageSellerCard.user', 'storageSellerUser')
      .innerJoin('purchase.card', 'buyerCard')
      .innerJoin('buyerCard.user', 'buyerUser')
      .leftJoin('good.states', 'state', 'state.createdAt < purchase.createdAt')
      .leftJoin(
        'good.states',
        'next',
        'state.createdAt < next.createdAt AND next.createdAt < purchase.createdAt',
      )
      .where('next.id IS NULL')
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('purchase.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.BUYER}`)
                  .andWhere('buyerUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.SELLER}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where('shopUser.id = :userId')
                        .orWhere('marketSellerUser.id = :userId')
                        .orWhere('storageSellerUser.id = :userId'),
                    ),
                  ),
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
                        .orWhere('marketOwnerUser.id = :userId')
                        .orWhere('storageOwnerUser.id = :userId'),
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
                  .where(`${!req.mode || req.mode === Mode.BUYER}`)
                  .andWhere('buyerCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.SELLER}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where('shopCard.id = :userId')
                        .orWhere('marketSellerCard.id = :userId')
                        .orWhere('storageSellerCard.id = :userId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.OWNER}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where('shopCard.id = :userId')
                        .orWhere('marketOwnerCard.id = :userId')
                        .orWhere('storageOwnerCard.id = :userId'),
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
          qb
            .where(`${!req.minPrice}`)
            .orWhere('state.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('state.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('purchase.createdAt >= :minDate', {
              minDate: req.minDate,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('purchase.rate = :rate', { rate: req.rate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('purchase.createdAt <= :maxDate', {
              maxDate: req.maxDate,
            }),
        ),
      )
      .orderBy('purchase.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
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
        'marketOwnerCard.id',
        'marketOwnerUser.id',
        'marketOwnerUser.nick',
        'marketOwnerUser.avatar',
        'marketOwnerCard.name',
        'marketOwnerCard.color',
        'market.name',
        'market.x',
        'market.y',
        'stall.name',
        'marketSellerCard.id',
        'marketSellerUser.id',
        'marketSellerUser.nick',
        'marketSellerUser.avatar',
        'marketSellerCard.name',
        'marketSellerCard.color',
        'lease.id',
        'cell.id',
        'storage.id',
        'storageOwnerCard.id',
        'storageOwnerUser.id',
        'storageOwnerUser.nick',
        'storageOwnerUser.avatar',
        'storageOwnerCard.name',
        'storageOwnerCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
        'storageSellerCard.id',
        'storageSellerUser.id',
        'storageSellerUser.nick',
        'storageSellerUser.avatar',
        'storageSellerCard.name',
        'storageSellerCard.color',
        'good.item',
        'good.description',
        'good.intake',
        'good.kit',
        'state.price',
        'buyerCard.id',
        'buyerUser.id',
        'buyerUser.nick',
        'buyerUser.avatar',
        'buyerCard.name',
        'buyerCard.color',
        'purchase.amount',
        'purchase.createdAt',
        'purchase.rate',
      ]);
  }
}
