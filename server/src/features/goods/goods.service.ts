import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
import { Good } from './good.entity';
import { GoodState } from './good-state.entity';
import { Purchase } from '../purchases/purchase.entity';
import { ShopsService } from '../shops/shops.service';
import { TransactionsService } from '../transactions/transactions.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  BuyGoodDto,
  ExtCreateGoodDto,
  ExtEditGoodDto,
  ExtGoodIdDto,
  ExtUpdateGoodDto,
} from './good.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { GoodError } from './good-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class GoodsService {
  private goodsRepositoryMap: Map<string, Repository<Good>>;
  private goodsStatesRepositoryMap: Map<string, Repository<GoodState>>;

  constructor(
    @InjectRepository(Good, Database.DB1)
    private goods1Repository: Repository<Good>,
    @InjectRepository(Good, Database.DB2)
    private goods2Repository: Repository<Good>,
    @InjectRepository(GoodState, Database.DB1)
    private goodsStates1Repository: Repository<GoodState>,
    @InjectRepository(GoodState, Database.DB2)
    private goodsStates2Repository: Repository<GoodState>,
    private shopsService: ShopsService,
    private transactionsService: TransactionsService,
    private mqttService: MqttService,
  ) {
    this.goodsRepositoryMap = new Map(
      [this.goods1Repository, this.goods2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
    this.goodsStatesRepositoryMap = new Map(
      [this.goodsStates1Repository, this.goodsStates2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMainGoods(project: string, req: Request): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(project, req)
      .andWhere('good.amount > 0')
      .getManyAndCount();
    return { result, count };
  }

  async getMyGoods(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(project, req)
      .innerJoin('sellerAccount.cards', 'sellerCards')
      .andWhere('sellerCards.userId = :myId', { myId })
      .andWhere('sellerCards.completedAt IS NULL')
      .getManyAndCount();
    return { result, count };
  }

  async getAllGoods(project: string, req: Request): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async selectGoodStates(
    project: string,
    goodId: number,
  ): Promise<GoodState[]> {
    const good = await this.goodsRepositoryMap
      .get(project)
      .createQueryBuilder('good')
      .leftJoin('good.states', 'state')
      .where('good.id = :goodId', { goodId })
      .orderBy('state.id', 'DESC')
      .select([
        'good.id',
        'good.price',
        'state.id',
        'state.price',
        'state.createdAt',
      ])
      .getOne();
    return good.states;
  }

  async selectGoodPurchases(
    project: string,
    goodId: number,
  ): Promise<Purchase[]> {
    const good = await this.goodsRepositoryMap
      .get(project)
      .createQueryBuilder('good')
      .leftJoin('good.purchases', 'purchase')
      .leftJoin('purchase.card', 'card')
      .leftJoin('card.account', 'account')
      .leftJoin('card.user', 'user')
      .leftJoin('purchase.delivery', 'delivery')
      .leftJoin('delivery.executorCard', 'executorCard')
      .leftJoin('executorCard.account', 'executorAccount')
      .leftJoin('executorCard.user', 'executorUser')
      .where('good.id = :goodId', { goodId })
      .orderBy('purchase.id', 'DESC')
      .select([
        'good.id',
        'purchase.id',
        'card.id',
        'account.id',
        'account.name',
        'account.color',
        'user.id',
        'user.nick',
        'user.avatar',
        'purchase.amount',
        'purchase.createdAt',
        'delivery.id',
        'delivery.status',
        'executorCard.id',
        'executorAccount.id',
        'executorAccount.name',
        'executorAccount.color',
        'executorUser.id',
        'executorUser.nick',
        'executorUser.avatar',
      ])
      .getOne();
    return good.purchases;
  }

  async createGood(project: string, dto: ExtCreateGoodDto): Promise<void> {
    const shop = await this.shopsService.checkShopOwner(
      project,
      dto.shopId,
      dto.myId,
      dto.hasRole,
    );
    const card = dto.hasRole
      ? shop.card
      : shop.card.account.cards.find((card) => card.userId === dto.myId);
    const good = await this.create(project, dto, card.id);
    this.mqttService.publishNotification(
      project,
      good.id,
      0,
      card.userId,
      Notification.CREATED_GOOD,
    );
  }

  async editGood(project: string, dto: ExtEditGoodDto): Promise<void> {
    const good = await this.checkGoodOwner(
      project,
      dto.goodId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkGoodNotBought(project, dto.goodId);
    await this.edit(project, good, dto);
  }

  async updateGood(project: string, dto: ExtUpdateGoodDto): Promise<void> {
    const good = await this.checkGoodOwner(
      project,
      dto.goodId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkGoodBought(project, dto.goodId);
    await this.update(project, good, dto);
  }

  async completeGood(project: string, dto: ExtGoodIdDto): Promise<void> {
    const good = await this.checkGoodOwner(
      project,
      dto.goodId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkGoodBought(project, dto.goodId);
    await this.complete(project, good);
    this.unpublishNotification(project, dto.goodId, good.card.userId);
  }

  async deleteGood(project: string, dto: ExtGoodIdDto): Promise<void> {
    const good = await this.checkGoodOwner(
      project,
      dto.goodId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkGoodNotBought(project, dto.goodId);
    await this.delete(project, good);
    this.unpublishNotification(project, dto.goodId, good.card.userId);
  }

  async buyGood(project: string, dto: BuyGoodDto): Promise<[Good, number]> {
    const good = await this.goodsRepositoryMap.get(project).findOne({
      relations: ['card', 'shop'],
      where: { id: dto.goodId },
    });
    if (good.amount < dto.amount) {
      throw new AppException(GoodError.NOT_ENOUGH_AMOUNT);
    }
    if (good.completedAt || good.shop?.completedAt) {
      throw new AppException(GoodError.ALREADY_EXPIRED);
    }
    const userId = await this.transactionsService.createTransferWithReturn(
      project,
      {
        myId: dto.myId,
        hasRole: dto.hasRole,
        senderCardId: dto.cardId,
        receiverCardId: good.cardId,
        sum: dto.amount * good.price,
        description: 'купівля товару',
        item: good.item,
      },
    );
    await this.buy(project, good, dto.amount);
    if (!good.amount) {
      this.mqttService.publishNotification(
        project,
        good.id,
        good.card.userId,
        0,
        Notification.ENDED_GOOD,
      );
    }
    return [good, userId];
  }

  async unbuyGood(project: string, id: number, amount: number): Promise<void> {
    const good = await this.goodsRepositoryMap.get(project).findOneBy({ id });
    await this.unbuy(project, good, amount);
  }

  async checkGoodExists(project: string, id: number): Promise<void> {
    await this.goodsRepositoryMap.get(project).findOneByOrFail({ id });
  }

  async checkGoodOwner(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Good> {
    const good = await this.goodsRepositoryMap.get(project).findOne({
      relations: ['card', 'card.account', 'card.account.cards', 'shop'],
      where: { id, card: { account: { cards: { completedAt: IsNull() } } } },
    });
    const card = good.card.account.cards.find((card) => card.userId === userId);
    if (!card && !hasRole) {
      throw new AppException(GoodError.NOT_OWNER);
    }
    if (good.completedAt || good.shop?.completedAt) {
      throw new AppException(GoodError.ALREADY_COMPLETED);
    }
    return good;
  }

  private async checkGoodBought(project: string, id: number): Promise<void> {
    const good = await this.goodsRepositoryMap.get(project).findOne({
      relations: ['purchases'],
      where: { id },
    });
    if (!good.purchases.length) {
      throw new AppException(GoodError.NOT_BOUGHT);
    }
  }

  private async checkGoodNotBought(project: string, id: number): Promise<void> {
    const good = await this.goodsRepositoryMap.get(project).findOne({
      relations: ['purchases'],
      where: { id },
    });
    if (good.purchases.length) {
      throw new AppException(GoodError.ALREADY_BOUGHT);
    }
  }

  private async create(
    project: string,
    dto: ExtCreateGoodDto,
    cardId: number,
  ): Promise<Good> {
    try {
      const good = this.goodsRepositoryMap.get(project).create({
        cardId,
        shopId: dto.shopId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.goodsRepositoryMap.get(project).save(good);
      const goodState = this.goodsStatesRepositoryMap.get(project).create({
        goodId: good.id,
        price: dto.price,
      });
      await this.goodsStatesRepositoryMap.get(project).save(goodState);
      return good;
    } catch (error) {
      throw new AppException(GoodError.CREATE_FAILED);
    }
  }

  private async edit(
    project: string,
    good: Good,
    dto: ExtEditGoodDto,
  ): Promise<void> {
    try {
      const equal = good.price === dto.price;
      good.item = dto.item;
      good.description = dto.description;
      good.amount = dto.amount;
      good.intake = dto.intake;
      good.kit = dto.kit;
      good.price = dto.price;
      await this.goodsRepositoryMap.get(project).save(good);
      if (!equal) {
        const goodState = this.goodsStatesRepositoryMap.get(project).create({
          goodId: good.id,
          price: good.price,
        });
        await this.goodsStatesRepositoryMap.get(project).save(goodState);
      }
    } catch (error) {
      throw new AppException(GoodError.EDIT_FAILED);
    }
  }

  private async update(
    project: string,
    good: Good,
    dto: ExtUpdateGoodDto,
  ): Promise<void> {
    try {
      const equal = good.price === dto.price;
      good.amount = dto.amount;
      good.price = dto.price;
      await this.goodsRepositoryMap.get(project).save(good);
      if (!equal) {
        const goodState = this.goodsStatesRepositoryMap.get(project).create({
          goodId: good.id,
          price: good.price,
        });
        await this.goodsStatesRepositoryMap.get(project).save(goodState);
      }
    } catch (error) {
      throw new AppException(GoodError.UPDATE_FAILED);
    }
  }

  private async complete(project: string, good: Good): Promise<void> {
    try {
      good.amount = 0;
      good.completedAt = new Date();
      await this.goodsRepositoryMap.get(project).save(good);
    } catch (error) {
      throw new AppException(GoodError.COMPLETE_FAILED);
    }
  }

  private async delete(project: string, good: Good): Promise<void> {
    try {
      await this.goodsRepositoryMap.get(project).remove(good);
    } catch (error) {
      throw new AppException(GoodError.DELETE_FAILED);
    }
  }

  private async buy(
    project: string,
    good: Good,
    amount: number,
  ): Promise<void> {
    try {
      good.amount -= amount;
      await this.goodsRepositoryMap.get(project).save(good);
    } catch (error) {
      throw new AppException(GoodError.BUY_FAILED);
    }
  }

  private async unbuy(
    project: string,
    good: Good,
    amount: number,
  ): Promise<void> {
    try {
      good.amount += amount;
      await this.goodsRepositoryMap.get(project).save(good);
    } catch (error) {
      throw new AppException(GoodError.UNBUY_FAILED);
    }
  }

  private unpublishNotification(
    project: string,
    id: number,
    userId: number,
  ): void {
    this.mqttService.unpublishNotification(
      project,
      id,
      0,
      userId,
      Notification.CREATED_GOOD,
    );
  }

  private getGoodsQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Good> {
    return this.goodsRepositoryMap
      .get(project)
      .createQueryBuilder('good')
      .innerJoin('good.card', 'sellerCard')
      .innerJoin('sellerCard.account', 'sellerAccount')
      .innerJoin('sellerCard.user', 'sellerUser')
      .innerJoin('good.shop', 'shop')
      .innerJoin('shop.card', 'shopCard')
      .innerJoin('shopCard.account', 'shopAccount')
      .innerJoin('shopCard.user', 'shopUser')
      .loadRelationCountAndMap('good.states', 'good.states')
      .loadRelationCountAndMap('good.purchases', 'good.purchases')
      .where('good.completedAt IS NULL')
      .andWhere('shop.completedAt IS NULL')
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('good.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
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
            .orWhere('good.amount >= :minAmount', { minAmount: req.minAmount }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxAmount}`)
            .orWhere('good.amount <= :maxAmount', { maxAmount: req.maxAmount }),
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
            .orWhere('good.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('good.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('good.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('good.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('good.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
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
        'good.amount',
        'good.intake',
        'good.kit',
        'good.price',
        'good.createdAt',
      ]);
  }
}
