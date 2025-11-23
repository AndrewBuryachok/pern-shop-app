import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Purchase } from './purchase.entity';
import { DeliveriesService } from '../deliveries/deliveries.service';
import { GoodsService } from '../goods/goods.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreatePurchaseDto } from './purchase.dto';
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
      .innerJoin('buyerAccount.cards', 'buyerCards')
      .andWhere('buyerCards.userId = :myId', { myId })
      .andWhere('buyerCards.completedAt IS NULL')
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedPurchases(
    myId: number,
    req: Request,
  ): Promise<Response<Purchase>> {
    const [result, count] = await this.getPurchasesQueryBuilder(req)
      .innerJoin('sellerAccount.cards', 'sellerCards')
      .andWhere('sellerCards.userId = :myId', { myId })
      .andWhere('sellerCards.completedAt IS NULL')
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
      .innerJoin('card.account', 'account')
      .innerJoin('account.cards', 'cards')
      .leftJoinAndMapOne('delivery', 'purchase.deliveries', 'delivery')
      .where('cards.userId = :userId', { userId })
      .andWhere('delivery.id IS NULL')
      .getMany();
  }

  async createPurchase(dto: ExtCreatePurchaseDto): Promise<void> {
    const [good, userId] = await this.goodsService.buyGood(dto);
    const purchase = await this.create(dto);
    this.mqttService.publishNotification(
      purchase.id,
      good.card.userId,
      userId,
      Notification.CREATED_PURCHASE,
    );
    if (dto.rate) {
      this.mqttService.publishNotification(
        purchase.id,
        good.card.userId,
        userId,
        Notification.RATED_PURCHASE,
      );
    }
    if (dto.stationId && dto.price) {
      await this.deliveriesService.createDelivery({
        ...dto,
        purchaseId: purchase.id,
      });
    }
  }

  async deletePurchase(id: number): Promise<void> {
    const purchase = await this.purchasesRepository.findOneBy({ id });
    await this.goodsService.unbuyGood(purchase.goodId, purchase.amount);
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
      relations: ['card', 'card.account', 'card.account.cards'],
      where: { id, card: { account: { cards: { completedAt: IsNull() } } } },
    });
    const card = purchase.card.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
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
        rate: dto.rate || null,
      });
      await this.purchasesRepository.save(purchase);
      return purchase;
    } catch (error) {
      throw new AppException(PurchaseError.CREATE_FAILED);
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
      .innerJoin('good.card', 'sellerCard')
      .innerJoin('sellerCard.account', 'sellerAccount')
      .innerJoin('sellerCard.user', 'sellerUser')
      .leftJoin('good.shop', 'shop')
      .leftJoin('shop.card', 'shopCard')
      .leftJoin('shopCard.account', 'shopAccount')
      .leftJoin('shopCard.user', 'shopUser')
      .leftJoin('good.rent', 'rent')
      .leftJoin('rent.stall', 'stall')
      .leftJoin('stall.market', 'market')
      .leftJoin('market.card', 'marketCard')
      .leftJoin('marketCard.account', 'marketAccount')
      .leftJoin('marketCard.user', 'marketUser')
      .leftJoin('good.lease', 'lease')
      .leftJoin('lease.cell', 'cell')
      .leftJoin('cell.storage', 'storage')
      .leftJoin('storage.card', 'storageCard')
      .leftJoin('storageCard.account', 'storageAccount')
      .leftJoin('storageCard.user', 'storageUser')
      .innerJoin('purchase.card', 'buyerCard')
      .innerJoin('buyerCard.account', 'buyerAccount')
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
                  .andWhere('sellerUser.id = :userId'),
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
                        .orWhere('storageUser.id = :userId'),
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
                  .andWhere('sellerCard.id = :cardId'),
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
                        .orWhere('storageCard.id = :cardId'),
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
            .where(`${!req.maxDate}`)
            .orWhere('purchase.createdAt <= :maxDate', {
              maxDate: req.maxDate,
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
      .orderBy('purchase.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'purchase.id',
        'good.id',
        'sellerCard.id',
        'sellerAccount.id',
        'sellerAccount.name',
        'sellerAccount.color',
        'sellerUser.id',
        'sellerUser.nick',
        'sellerUser.avatar',
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
        'rent.id',
        'stall.id',
        'market.id',
        'marketCard.id',
        'marketAccount.id',
        'marketAccount.name',
        'marketAccount.color',
        'marketUser.id',
        'marketUser.nick',
        'marketUser.avatar',
        'market.name',
        'market.x',
        'market.y',
        'stall.name',
        'lease.id',
        'cell.id',
        'storage.id',
        'storageCard.id',
        'storageAccount.id',
        'storageAccount.name',
        'storageAccount.color',
        'storageUser.id',
        'storageUser.nick',
        'storageUser.avatar',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
        'good.item',
        'good.description',
        'good.intake',
        'good.kit',
        'state.price',
        'buyerCard.id',
        'buyerAccount.id',
        'buyerAccount.name',
        'buyerAccount.color',
        'buyerUser.id',
        'buyerUser.nick',
        'buyerUser.avatar',
        'purchase.amount',
        'purchase.createdAt',
        'purchase.rate',
      ]);
  }
}
