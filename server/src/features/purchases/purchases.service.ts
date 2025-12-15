import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
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
  private purchasesRepositoryMap: Map<string, Repository<Purchase>>;

  constructor(
    @InjectRepository(Purchase, Database.DB1)
    private purchases1Repository: Repository<Purchase>,
    @InjectRepository(Purchase, Database.DB2)
    private purchases2Repository: Repository<Purchase>,
    @Inject(forwardRef(() => DeliveriesService))
    private deliveriesService: DeliveriesService,
    private goodsService: GoodsService,
    private mqttService: MqttService,
  ) {
    this.purchasesRepositoryMap = new Map(
      [this.purchases1Repository, this.purchases2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMyPurchases(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Purchase>> {
    const [result, count] = await this.getPurchasesQueryBuilder(project, req)
      .innerJoin('buyerAccount.cards', 'buyerCards')
      .innerJoin('sellerAccount.cards', 'sellerCards')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(
              new Brackets((qb) =>
                qb
                  .where('buyerCards.userId = :myId')
                  .andWhere('buyerCards.completedAt IS NULL'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where('sellerCards.userId = :myId')
                  .andWhere('sellerCards.completedAt IS NULL'),
              ),
            ),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllPurchases(
    project: string,
    req: Request,
  ): Promise<Response<Purchase>> {
    const [result, count] = await this.getPurchasesQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectUserPurchases(project: string, userId: number): Promise<Purchase[]> {
    return this.selectPurchasesQueryBuilder(project)
      .innerJoin('purchase.card', 'card')
      .innerJoin('card.account', 'account')
      .innerJoin('account.cards', 'cards')
      .leftJoin('purchase.delivery', 'delivery')
      .where('cards.userId = :userId', { userId })
      .andWhere('delivery.id IS NULL')
      .getMany();
  }

  async createPurchase(
    project: string,
    dto: ExtCreatePurchaseDto,
  ): Promise<void> {
    const [good, userId] = await this.goodsService.buyGood(project, dto);
    const purchase = await this.create(project, dto);
    this.mqttService.publishNotification(
      project,
      purchase.id,
      good.card.userId,
      userId,
      Notification.CREATED_PURCHASE,
    );
    if (dto.rate) {
      this.mqttService.publishNotification(
        project,
        purchase.id,
        good.card.userId,
        userId,
        Notification.RATED_PURCHASE,
      );
    }
    if (dto.stationId && dto.sum) {
      await this.deliveriesService.createDelivery(project, {
        ...dto,
        purchaseId: purchase.id,
      });
    }
  }

  async deletePurchase(project: string, id: number): Promise<void> {
    const purchase = await this.purchasesRepositoryMap
      .get(project)
      .findOneBy({ id });
    await this.goodsService.unbuyGood(
      project,
      purchase.goodId,
      purchase.amount,
    );
    await this.delete(project, purchase);
  }

  async checkPurchaseExists(project: string, id: number): Promise<void> {
    await this.purchasesRepositoryMap.get(project).findOneByOrFail({ id });
  }

  async checkPurchaseOwner(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Purchase> {
    const purchase = await this.purchasesRepositoryMap.get(project).findOne({
      relations: ['card', 'card.account', 'card.account.cards', 'good'],
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

  private async create(
    project: string,
    dto: ExtCreatePurchaseDto,
  ): Promise<Purchase> {
    try {
      const purchase = this.purchasesRepositoryMap.get(project).create({
        goodId: dto.goodId,
        cardId: dto.cardId,
        amount: dto.amount,
        rate: dto.rate || null,
      });
      await this.purchasesRepositoryMap.get(project).save(purchase);
      return purchase;
    } catch (error) {
      throw new AppException(PurchaseError.CREATE_FAILED);
    }
  }

  private async delete(project: string, purchase: Purchase): Promise<void> {
    try {
      await this.purchasesRepositoryMap.get(project).remove(purchase);
    } catch (error) {
      throw new AppException(PurchaseError.DELETE_FAILED);
    }
  }

  private selectPurchasesQueryBuilder(
    project: string,
  ): SelectQueryBuilder<Purchase> {
    return this.purchasesRepositoryMap
      .get(project)
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

  private getPurchasesQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Purchase> {
    return this.purchasesRepositoryMap
      .get(project)
      .createQueryBuilder('purchase')
      .innerJoin('purchase.good', 'good')
      .innerJoin('good.card', 'sellerCard')
      .innerJoin('sellerCard.account', 'sellerAccount')
      .innerJoin('sellerCard.user', 'sellerUser')
      .innerJoin('good.shop', 'shop')
      .innerJoin('shop.card', 'shopCard')
      .innerJoin('shopCard.account', 'shopAccount')
      .innerJoin('shopCard.user', 'shopUser')
      .innerJoin('purchase.card', 'buyerCard')
      .innerJoin('buyerCard.account', 'buyerAccount')
      .innerJoin('buyerCard.user', 'buyerUser')
      .leftJoin('good.states', 'state', 'state.createdAt < purchase.createdAt')
      .leftJoin(
        'good.states',
        'next',
        'state.createdAt < next.createdAt AND next.createdAt < purchase.createdAt',
      )
      .leftJoin('purchase.delivery', 'delivery')
      .leftJoin('delivery.executorCard', 'executorCard')
      .leftJoin('executorCard.account', 'executorAccount')
      .leftJoin('executorCard.user', 'executorUser')
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
                  .andWhere('shopUser.id = :userId'),
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
                  .andWhere('shopCard.id = :cardId'),
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
        'delivery.id',
        'delivery.status',
        'executorCard.id',
        'executorAccount.id',
        'executorAccount.name',
        'executorAccount.color',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
      ]);
  }
}
