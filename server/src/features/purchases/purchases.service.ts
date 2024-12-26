import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Purchase } from './purchase.entity';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { GoodsService } from '../goods/goods.service';
import { WaresService } from '../wares/wares.service';
import { ProductsService } from '../products/products.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateMarketPurchaseDto,
  ExtCreateShopPurchaseDto,
  ExtCreateStoragePurchaseDto,
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
    private waresService: WaresService,
    private productsService: ProductsService,
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

  async createShopPurchase(
    dto: ExtCreateShopPurchaseDto & { nick: string },
  ): Promise<void> {
    const good = await this.goodsService.buyGood(dto);
    const purchase = await this.createShop(dto);
    this.publishCreatePurchaseNotification(
      purchase.id,
      good.shop.card.userId,
      dto.nick,
    );
    if (dto.stationId && dto.price) {
      await this.deliveriesService.createDelivery({
        ...dto,
        purchaseId: purchase.id,
      });
    }
  }

  async createMarketPurchase(
    dto: ExtCreateMarketPurchaseDto & { nick: string },
  ): Promise<void> {
    const ware = await this.waresService.buyWare(dto);
    const purchase = await this.createMarket(dto);
    this.publishCreatePurchaseNotification(
      purchase.id,
      ware.rent.card.userId,
      dto.nick,
    );
    if (dto.stationId && dto.price) {
      await this.deliveriesService.createDelivery({
        ...dto,
        purchaseId: purchase.id,
      });
    }
  }

  async createStoragePurchase(
    dto: ExtCreateStoragePurchaseDto & { nick: string },
  ): Promise<void> {
    const product = await this.productsService.buyProduct(dto);
    const purchase = await this.createStorage(dto);
    this.publishCreatePurchaseNotification(
      purchase.id,
      product.lease.card.userId,
      dto.nick,
    );
    if (dto.stationId && dto.price) {
      await this.deliveriesService.createDelivery({
        ...dto,
        purchaseId: purchase.id,
      });
    }
  }

  private publishCreatePurchaseNotification(
    id: number,
    userId: number,
    nick: string,
  ): void {
    this.mqttService.publishNotificationMessage(
      id,
      userId,
      nick,
      Notification.CREATED_PURCHASE,
    );
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
    this.mqttService.publishNotificationMessage(
      dto.purchaseId,
      purchase.good?.shop.card.userId ||
        purchase.ware?.rent.card.userId ||
        purchase.product?.lease.card.userId,
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
        'ware',
        'ware.rent',
        'ware.rent.card',
        'product',
        'product.lease',
        'product.lease.card',
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

  private async createShop(dto: ExtCreateShopPurchaseDto): Promise<Purchase> {
    try {
      const purchase = this.purchasesRepository.create({
        goodId: dto.goodId,
        cardId: dto.cardId,
        amount: dto.amount,
      });
      await this.purchasesRepository.save(purchase);
      return purchase;
    } catch (error) {
      throw new AppException(PurchaseError.CREATE_SHOP_FAILED);
    }
  }

  private async createMarket(
    dto: ExtCreateMarketPurchaseDto,
  ): Promise<Purchase> {
    try {
      const purchase = this.purchasesRepository.create({
        wareId: dto.wareId,
        cardId: dto.cardId,
        amount: dto.amount,
      });
      await this.purchasesRepository.save(purchase);
      return purchase;
    } catch (error) {
      throw new AppException(PurchaseError.CREATE_MARKET_FAILED);
    }
  }

  private async createStorage(
    dto: ExtCreateStoragePurchaseDto,
  ): Promise<Purchase> {
    try {
      const purchase = this.purchasesRepository.create({
        productId: dto.productId,
        cardId: dto.cardId,
        amount: dto.amount,
      });
      await this.purchasesRepository.save(purchase);
      return purchase;
    } catch (error) {
      throw new AppException(PurchaseError.CREATE_STORAGE_FAILED);
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
      .leftJoin('purchase.good', 'good')
      .leftJoin('purchase.ware', 'ware')
      .leftJoin('purchase.product', 'product')
      .leftJoin(
        'good.states',
        'goodState',
        'goodState.createdAt < purchase.createdAt',
      )
      .leftJoin(
        'good.states',
        'goodNext',
        'goodState.createdAt < goodNext.createdAt AND goodNext.createdAt < purchase.createdAt',
      )
      .leftJoin(
        'ware.states',
        'wareState',
        'wareState.createdAt < purchase.createdAt',
      )
      .leftJoin(
        'ware.states',
        'wareNext',
        'wareState.createdAt < wareNext.createdAt AND wareNext.createdAt < purchase.createdAt',
      )
      .leftJoin(
        'product.states',
        'productState',
        'productState.createdAt < purchase.createdAt',
      )
      .leftJoin(
        'product.states',
        'productNext',
        'productState.createdAt < productNext.createdAt AND productNext.createdAt < purchase.createdAt',
      )
      .where('goodNext.id IS NULL')
      .andWhere('wareNext.id IS NULL')
      .andWhere('productNext.id IS NULL')
      .orderBy('purchase.id', 'DESC')
      .select([
        'purchase.id',
        'good.id',
        'good.item',
        'good.description',
        'good.intake',
        'good.kit',
        'goodState.price',
        'ware.id',
        'ware.item',
        'ware.description',
        'ware.intake',
        'ware.kit',
        'wareState.price',
        'product.id',
        'product.item',
        'product.description',
        'product.intake',
        'product.kit',
        'productState.price',
        'purchase.amount',
      ]);
  }

  private getPurchasesQueryBuilder(req: Request): SelectQueryBuilder<Purchase> {
    return this.purchasesRepository
      .createQueryBuilder('purchase')
      .leftJoin('purchase.good', 'good')
      .leftJoin('good.shop', 'shop')
      .leftJoin('shop.card', 'shopCard')
      .leftJoin('shopCard.user', 'shopUser')
      .leftJoin('purchase.ware', 'ware')
      .leftJoin('ware.rent', 'rent')
      .leftJoin('rent.stall', 'stall')
      .leftJoin('stall.market', 'market')
      .leftJoin('market.card', 'marketOwnerCard')
      .leftJoin('marketOwnerCard.user', 'marketOwnerUser')
      .leftJoin('rent.card', 'marketSellerCard')
      .leftJoin('marketSellerCard.user', 'marketSellerUser')
      .leftJoin('purchase.product', 'product')
      .leftJoin('product.lease', 'lease')
      .leftJoin('lease.cell', 'cell')
      .leftJoin('cell.storage', 'storage')
      .leftJoin('storage.card', 'storageOwnerCard')
      .leftJoin('storageOwnerCard.user', 'storageOwnerUser')
      .leftJoin('lease.card', 'storageSellerCard')
      .leftJoin('storageSellerCard.user', 'storageSellerUser')
      .innerJoin('purchase.card', 'buyerCard')
      .innerJoin('buyerCard.user', 'buyerUser')
      .leftJoin(
        'good.states',
        'goodState',
        'goodState.createdAt < purchase.createdAt',
      )
      .leftJoin(
        'good.states',
        'goodNext',
        'goodState.createdAt < goodNext.createdAt AND goodNext.createdAt < purchase.createdAt',
      )
      .leftJoin(
        'ware.states',
        'wareState',
        'wareState.createdAt < purchase.createdAt',
      )
      .leftJoin(
        'ware.states',
        'wareNext',
        'wareState.createdAt < wareNext.createdAt AND wareNext.createdAt < purchase.createdAt',
      )
      .leftJoin(
        'product.states',
        'productState',
        'productState.createdAt < purchase.createdAt',
      )
      .leftJoin(
        'product.states',
        'productNext',
        'productState.createdAt < productNext.createdAt AND productNext.createdAt < purchase.createdAt',
      )
      .where('goodNext.id IS NULL')
      .andWhere('wareNext.id IS NULL')
      .andWhere('productNext.id IS NULL')
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
            .where(`${!req.item}`, { item: req.item })
            .orWhere('good.item = :item')
            .orWhere('ware.item = :item')
            .orWhere('product.item = :item'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`, { description: req.description })
            .orWhere('good.description ILIKE :description')
            .orWhere('ware.description ILIKE :description')
            .orWhere('product.description ILIKE :description'),
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
            .where(`${!req.minIntake}`, { minIntake: req.minIntake })
            .orWhere('good.intake >= :minIntake')
            .orWhere('ware.intake >= :minIntake')
            .orWhere('product.intake >= :minIntake'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxIntake}`, { maxIntake: req.maxIntake })
            .orWhere('good.intake <= :maxIntake')
            .orWhere('ware.intake <= :maxIntake')
            .orWhere('product.intake <= :maxIntake'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.kit}`, { kit: req.kit })
            .orWhere('good.kit = :kit')
            .orWhere('ware.kit = :kit')
            .orWhere('product.kit = :kit'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`, { minPrice: req.minPrice })
            .orWhere('goodState.price >= :minPrice')
            .orWhere('wareState.price >= :minPrice')
            .orWhere('productState.price >= :minPrice'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`, { maxPrice: req.maxPrice })
            .orWhere('goodState.price <= :maxPrice')
            .orWhere('wareState.price <= :maxPrice')
            .orWhere('productState.price <= :maxPrice'),
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
        'good.item',
        'good.description',
        'good.intake',
        'good.kit',
        'goodState.price',
        'ware.id',
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
        'ware.item',
        'ware.description',
        'ware.intake',
        'ware.kit',
        'wareState.price',
        'product.id',
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
        'product.item',
        'product.description',
        'product.intake',
        'product.kit',
        'productState.price',
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
