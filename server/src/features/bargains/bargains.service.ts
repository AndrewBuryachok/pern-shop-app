import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Bargain } from './bargain.entity';
import { ShopsDeliveriesService } from '../shops-deliveries/shops-deliveries.service';
import { GoodsService } from '../goods/goods.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateBargainDto,
  ExtRateBargainDto,
  BargainIdDto,
} from './bargain.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { BargainError } from './bargain-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class BargainsService {
  constructor(
    @InjectRepository(Bargain)
    private bargainsRepository: Repository<Bargain>,
    @Inject(forwardRef(() => ShopsDeliveriesService))
    private shopsDeliveriesService: ShopsDeliveriesService,
    private goodsService: GoodsService,
    private mqttService: MqttService,
  ) {}

  async getMyBargains(myId: number, req: Request): Promise<Response<Bargain>> {
    const [result, count] = await this.getBargainsQueryBuilder(req)
      .innerJoin('buyerCard.users', 'buyerUsers')
      .andWhere('buyerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getSoldBargains(
    myId: number,
    req: Request,
  ): Promise<Response<Bargain>> {
    const [result, count] = await this.getBargainsQueryBuilder(req)
      .innerJoin('sellerCard.users', 'sellerUsers')
      .andWhere('sellerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllBargains(req: Request): Promise<Response<Bargain>> {
    const [result, count] = await this.getBargainsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectUserBargains(userId: number): Promise<Bargain[]> {
    return this.selectBargainsQueryBuilder()
      .innerJoin('bargain.card', 'card')
      .leftJoin('card.users', 'users')
      .leftJoinAndMapOne('delivery', 'bargain.deliveries', 'delivery')
      .where('users.id = :userId', { userId })
      .andWhere('delivery.id IS NULL')
      .getMany();
  }

  async createBargain(
    dto: ExtCreateBargainDto & { nick: string },
  ): Promise<void> {
    const good = await this.goodsService.buyGood(dto);
    const bargain = await this.create(dto);
    this.mqttService.publishNotificationMessage(
      bargain.id,
      good.shop.card.userId,
      dto.nick,
      Notification.CREATED_BARGAIN,
    );
    if (dto.stationId && dto.price) {
      await this.shopsDeliveriesService.createShopDelivery({
        ...dto,
        bargainId: bargain.id,
      });
    }
  }

  async rateBargain(dto: ExtRateBargainDto & { nick: string }): Promise<void> {
    const bargain = await this.checkBargainOwner(
      dto.bargainId,
      dto.myId,
      dto.hasRole,
    );
    await this.rate(bargain, dto.rate);
    this.mqttService.publishNotificationMessage(
      dto.bargainId,
      bargain.good.shop.card.userId,
      dto.nick,
      Notification.RATED_BARGAIN,
    );
  }

  async deleteBargain(dto: BargainIdDto): Promise<void> {
    const bargain = await this.bargainsRepository.findOneBy({
      id: dto.bargainId,
    });
    await this.delete(bargain);
  }

  async checkBargainExists(id: number): Promise<void> {
    await this.bargainsRepository.findOneByOrFail({ id });
  }

  async checkBargainOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Bargain> {
    const bargain = await this.bargainsRepository.findOne({
      relations: ['card', 'card.users', 'good', 'good.shop', 'good.shop.card'],
      where: { id },
    });
    if (
      !bargain.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(BargainError.NOT_OWNER);
    }
    return bargain;
  }

  private async create(dto: ExtCreateBargainDto): Promise<Bargain> {
    try {
      const bargain = this.bargainsRepository.create({
        goodId: dto.goodId,
        cardId: dto.cardId,
        amount: dto.amount,
      });
      await this.bargainsRepository.save(bargain);
      return bargain;
    } catch (error) {
      throw new AppException(BargainError.CREATE_FAILED);
    }
  }

  private async rate(bargain: Bargain, rate: number): Promise<void> {
    try {
      bargain.rate = rate;
      await this.bargainsRepository.save(bargain);
    } catch (error) {
      throw new AppException(BargainError.RATE_FAILED);
    }
  }

  private async delete(bargain: Bargain): Promise<void> {
    try {
      await this.bargainsRepository.remove(bargain);
    } catch (error) {
      throw new AppException(BargainError.DELETE_FAILED);
    }
  }

  private selectBargainsQueryBuilder(): SelectQueryBuilder<Bargain> {
    return this.bargainsRepository
      .createQueryBuilder('bargain')
      .innerJoin('bargain.good', 'good')
      .leftJoin('good.states', 'state', 'state.createdAt < bargain.createdAt')
      .leftJoin(
        'good.states',
        'next',
        'state.createdAt < next.createdAt AND next.createdAt < bargain.createdAt',
      )
      .where('next.id IS NULL')
      .orderBy('bargain.id', 'DESC')
      .select([
        'bargain.id',
        'good.id',
        'good.item',
        'good.description',
        'good.intake',
        'good.kit',
        'state.price',
        'bargain.amount',
      ]);
  }

  private getBargainsQueryBuilder(req: Request): SelectQueryBuilder<Bargain> {
    return this.bargainsRepository
      .createQueryBuilder('bargain')
      .innerJoin('bargain.good', 'good')
      .innerJoin('good.shop', 'shop')
      .innerJoin('shop.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .innerJoin('bargain.card', 'buyerCard')
      .innerJoin('buyerCard.user', 'buyerUser')
      .leftJoin('good.states', 'state', 'state.createdAt < bargain.createdAt')
      .leftJoin(
        'good.states',
        'next',
        'state.createdAt < next.createdAt AND next.createdAt < bargain.createdAt',
      )
      .where('next.id IS NULL')
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('bargain.id = :id', { id: req.id }),
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
            .orWhere('bargain.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('bargain.rate = :rate', { rate: req.rate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('bargain.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('bargain.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'bargain.id',
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
        'good.intake',
        'good.kit',
        'state.price',
        'buyerCard.id',
        'buyerUser.id',
        'buyerUser.nick',
        'buyerUser.avatar',
        'buyerCard.name',
        'buyerCard.color',
        'bargain.amount',
        'bargain.createdAt',
        'bargain.rate',
      ]);
  }
}
