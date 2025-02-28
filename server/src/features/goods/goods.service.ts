import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Good } from './good.entity';
import { GoodState } from './good-state.entity';
import { ShopsService } from '../shops/shops.service';
import { RentsService } from '../rents/rents.service';
import { LeasesService } from '../leases/leases.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  BuyGoodDto,
  CompleteGoodDto,
  ExtCreateMarketGoodDto,
  ExtCreateShopGoodDto,
  ExtCreateStorageGoodDto,
  ExtEditGoodDto,
} from './good.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { GoodError } from './good-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Good)
    private goodsRepository: Repository<Good>,
    @InjectRepository(GoodState)
    private goodsStatesRepository: Repository<GoodState>,
    private shopsService: ShopsService,
    private rentsService: RentsService,
    private leasesService: LeasesService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainGoods(req: Request): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(req)
      .andWhere('good.amount > 0')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('rent.completedAt IS NULL')
            .orWhere('rent.completedAt > NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('lease.completedAt IS NULL')
            .orWhere('lease.completedAt > NOW()'),
        ),
      )
      .getManyAndCount();
    return { result, count };
  }

  async getMyGoods(myId: number, req: Request): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(req)
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

  async getPlacedGoods(myId: number, req: Request): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(req)
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

  async getAllGoods(req: Request): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async selectGoodStates(goodId: number): Promise<GoodState[]> {
    const good = await this.goodsRepository
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

  async selectGoodRating(goodId: number): Promise<{ rate: number }> {
    const good = await this.goodsRepository
      .createQueryBuilder('good')
      .leftJoin('good.purchases', 'purchase')
      .where('good.id = :goodId', { goodId })
      .select('AVG(purchase.rate)', 'rate')
      .getRawOne();
    return { rate: +good.rate };
  }

  async createShopGood(
    dto: ExtCreateShopGoodDto & { nick: string },
  ): Promise<void> {
    await this.shopsService.checkShopOwner(dto.shopId, dto.myId, dto.hasRole);
    const good = await this.createShop(dto);
    this.publishCreateGoodNotification(good.id, dto.nick);
  }

  async createMarketGood(
    dto: ExtCreateMarketGoodDto & { nick: string },
  ): Promise<void> {
    await this.rentsService.checkRentOwner(dto.rentId, dto.myId, dto.hasRole);
    const good = await this.createMarket(dto);
    this.publishCreateGoodNotification(good.id, dto.nick);
  }

  async createStorageGood(
    dto: ExtCreateStorageGoodDto & { nick: string },
  ): Promise<void> {
    await this.leasesService.checkLeaseOwner(
      dto.leaseId,
      dto.myId,
      dto.hasRole,
    );
    const good = await this.createStorage(dto);
    this.publishCreateGoodNotification(good.id, dto.nick);
  }

  private publishCreateGoodNotification(id: number, nick: string): void {
    this.mqttService.publishNotification(
      id,
      0,
      nick,
      Notification.CREATED_GOOD,
    );
  }

  async editGood(dto: ExtEditGoodDto): Promise<void> {
    const good = await this.checkGoodOwner(dto.goodId, dto.myId, dto.hasRole);
    await this.edit(good, dto);
  }

  async completeGood(dto: CompleteGoodDto & { nick: string }): Promise<void> {
    const good = await this.checkGoodOwner(dto.goodId, dto.myId, dto.hasRole);
    await this.complete(good);
    this.mqttService.unpublishNotification(
      dto.goodId,
      0,
      dto.nick,
      Notification.CREATED_GOOD,
    );
  }

  async buyGood(dto: BuyGoodDto & { nick: string }): Promise<Good> {
    const good = await this.goodsRepository.findOne({
      relations: [
        'shop',
        'shop.card',
        'rent',
        'rent.card',
        'lease',
        'lease.card',
      ],
      where: { id: dto.goodId },
    });
    if (good.amount < dto.amount) {
      throw new AppException(GoodError.NOT_ENOUGH_AMOUNT);
    }
    if (
      good.completedAt ||
      good.rent?.completedAt < new Date() ||
      good.lease?.completedAt < new Date()
    ) {
      throw new AppException(GoodError.ALREADY_EXPIRED);
    }
    const receiverCardId =
      good.shop?.cardId || good.rent?.cardId || good.lease?.cardId;
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId,
      sum: dto.amount * good.price,
      description: '',
    });
    await this.buy(good, dto.amount);
    if (!good.amount) {
      const userId =
        good.shop?.card.userId ||
        good.rent?.card.userId ||
        good.lease?.card.userId;
      this.mqttService.publishNotification(
        good.id,
        userId,
        '🔔',
        Notification.ENDED_GOOD,
      );
    }
    return good;
  }

  async unbuyGood(id: number, amount: number): Promise<void> {
    const good = await this.goodsRepository.findOneBy({ id });
    await this.unbuy(good, amount);
  }

  async checkGoodExists(id: number): Promise<void> {
    await this.goodsRepository.findOneByOrFail({ id });
  }

  async checkGoodOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Good> {
    const good = await this.goodsRepository.findOne({
      relations: [
        'shop',
        'shop.card',
        'shop.card.users',
        'rent',
        'rent.card',
        'rent.card.users',
        'lease',
        'lease.card',
        'lease.card.users',
      ],
      where: { id },
    });
    if (
      !good.shop?.card.users.map((user) => user.id).includes(userId) &&
      !good.rent?.card.users.map((user) => user.id).includes(userId) &&
      !good.lease?.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(GoodError.NOT_OWNER);
    }
    if (good.completedAt) {
      throw new AppException(GoodError.ALREADY_COMPLETED);
    }
    return good;
  }

  private async createShop(dto: ExtCreateShopGoodDto): Promise<Good> {
    try {
      const good = this.goodsRepository.create({
        shopId: dto.shopId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.goodsRepository.save(good);
      const goodState = this.goodsStatesRepository.create({
        goodId: good.id,
        price: dto.price,
      });
      await this.goodsStatesRepository.save(goodState);
      return good;
    } catch (error) {
      throw new AppException(GoodError.CREATE_SHOP_FAILED);
    }
  }

  private async createMarket(dto: ExtCreateMarketGoodDto): Promise<Good> {
    try {
      const good = this.goodsRepository.create({
        rentId: dto.rentId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.goodsRepository.save(good);
      const goodState = this.goodsStatesRepository.create({
        goodId: good.id,
        price: dto.price,
      });
      await this.goodsStatesRepository.save(goodState);
      return good;
    } catch (error) {
      throw new AppException(GoodError.CREATE_MARKET_FAILED);
    }
  }

  private async createStorage(dto: ExtCreateStorageGoodDto): Promise<Good> {
    try {
      const good = this.goodsRepository.create({
        leaseId: dto.leaseId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.goodsRepository.save(good);
      const goodState = this.goodsStatesRepository.create({
        goodId: good.id,
        price: dto.price,
      });
      await this.goodsStatesRepository.save(goodState);
      return good;
    } catch (error) {
      throw new AppException(GoodError.CREATE_STORAGE_FAILED);
    }
  }

  private async edit(good: Good, dto: ExtEditGoodDto): Promise<void> {
    try {
      const equal = good.price === dto.price;
      good.amount = dto.amount;
      good.price = dto.price;
      await this.goodsRepository.save(good);
      if (!equal) {
        const goodState = this.goodsStatesRepository.create({
          goodId: good.id,
          price: good.price,
        });
        await this.goodsStatesRepository.save(goodState);
      }
    } catch (error) {
      throw new AppException(GoodError.EDIT_FAILED);
    }
  }

  private async complete(good: Good): Promise<void> {
    try {
      good.amount = 0;
      good.completedAt = new Date();
      await this.goodsRepository.save(good);
    } catch (error) {
      throw new AppException(GoodError.COMPLETE_FAILED);
    }
  }

  private async buy(good: Good, amount: number): Promise<void> {
    try {
      good.amount -= amount;
      await this.goodsRepository.save(good);
    } catch (error) {
      throw new AppException(GoodError.BUY_FAILED);
    }
  }

  private async unbuy(good: Good, amount: number): Promise<void> {
    try {
      good.amount += amount;
      await this.goodsRepository.save(good);
    } catch (error) {
      throw new AppException(GoodError.UNBUY_FAILED);
    }
  }

  private getGoodsQueryBuilder(req: Request): SelectQueryBuilder<Good> {
    return this.goodsRepository
      .createQueryBuilder('good')
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
      .loadRelationCountAndMap('good.states', 'good.states')
      .where(
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
                  .where(`${!req.mode || req.mode === Mode.SELLER}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where('shopCard.id = :cardId')
                        .orWhere('marketSellerCard.id = :cardId')
                        .orWhere('storageSellerCard.id = :cardId'),
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
                        .where('shopCard.id = :cardId')
                        .orWhere('marketOwnerCard.id = :cardId')
                        .orWhere('storageOwnerCard.id = :cardId'),
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
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('good.completedAt IS NOT NULL')
            .orWhere('rent.completedAt < NOW()')
            .orWhere('lease.completedAt < NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${req.completed !== -1}`).orWhere(
            new Brackets((qb) =>
              qb
                .where('good.completedAt IS NULL')
                .andWhere(
                  new Brackets((qb) =>
                    qb
                      .where('rent.completedAt IS NULL')
                      .orWhere('rent.completedAt > NOW()'),
                  ),
                )
                .andWhere(
                  new Brackets((qb) =>
                    qb
                      .where('lease.completedAt IS NULL')
                      .orWhere('lease.completedAt > NOW()'),
                  ),
                ),
            ),
          ),
        ),
      )
      .orderBy('good.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
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
        'good.amount',
        'good.intake',
        'good.kit',
        'good.price',
        'good.createdAt',
        'good.completedAt',
      ]);
  }
}
