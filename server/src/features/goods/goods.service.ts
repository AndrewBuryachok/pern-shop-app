import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Good } from './good.entity';
import { GoodState } from './good-state.entity';
import { ShopsService } from '../shops/shops.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  BuyGoodDto,
  CompleteGoodDto,
  ExtCreateGoodDto,
  ExtEditGoodDto,
} from './good.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { GoodError } from './good-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Good)
    private goodsRepository: Repository<Good>,
    @InjectRepository(GoodState)
    private goodsStatesRepository: Repository<GoodState>,
    private shopsService: ShopsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainGoods(req: Request): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(req)
      .andWhere('good.amount > 0')
      .getManyAndCount();
    return { result, count };
  }

  async getMyGoods(myId: number, req: Request): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(req)
      .innerJoin('sellerCard.users', 'sellerUsers')
      .andWhere('sellerUsers.id = :myId', { myId })
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
      .leftJoin('good.bargains', 'bargain')
      .where('good.id = :goodId', { goodId })
      .select('AVG(bargain.rate)', 'rate')
      .getRawOne();
    return { rate: +good.rate };
  }

  async createGood(dto: ExtCreateGoodDto & { nick: string }): Promise<void> {
    await this.shopsService.checkShopOwner(dto.shopId, dto.myId, dto.hasRole);
    const good = await this.create(dto);
    this.mqttService.publishNotificationMessage(
      good.id,
      0,
      dto.nick,
      Notification.CREATED_GOOD,
    );
  }

  async editGood(dto: ExtEditGoodDto): Promise<void> {
    const good = await this.checkGoodOwner(dto.goodId, dto.myId, dto.hasRole);
    await this.edit(good, dto);
  }

  async completeGood(dto: CompleteGoodDto): Promise<void> {
    const good = await this.checkGoodOwner(dto.goodId, dto.myId, dto.hasRole);
    await this.complete(good);
  }

  async buyGood(dto: BuyGoodDto & { nick: string }): Promise<Good> {
    const good = await this.goodsRepository.findOne({
      relations: ['shop', 'shop.card'],
      where: { id: dto.goodId },
    });
    if (good.amount < dto.amount) {
      throw new AppException(GoodError.NOT_ENOUGH_AMOUNT);
    }
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: good.shop.cardId,
      sum: dto.amount * good.price,
      description: '',
    });
    await this.buy(good, dto.amount);
    return good;
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
      relations: ['shop', 'shop.card', 'shop.card.users'],
      where: { id },
    });
    if (
      !good.shop.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(GoodError.NOT_OWNER);
    }
    if (good.completedAt) {
      throw new AppException(GoodError.ALREADY_COMPLETED);
    }
    return good;
  }

  private async create(dto: ExtCreateGoodDto): Promise<Good> {
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
      throw new AppException(GoodError.CREATE_FAILED);
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

  private getGoodsQueryBuilder(req: Request): SelectQueryBuilder<Good> {
    return this.goodsRepository
      .createQueryBuilder('good')
      .innerJoin('good.shop', 'shop')
      .innerJoin('shop.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
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
            .orWhere('sellerUser.id = :userId', { userId: req.user }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.card}`)
            .orWhere('sellerCard.id = :cardId', { cardId: req.card }),
        ),
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
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('good.completedAt IS NOT NULL'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('good.completedAt IS NULL'),
        ),
      )
      .orderBy('good.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'good.id',
        'shop.id',
        'sellerCard.id',
        'sellerUser.id',
        'sellerUser.nick',
        'sellerUser.avatar',
        'sellerCard.name',
        'sellerCard.color',
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
        'good.completedAt',
      ]);
  }
}
