import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Trade } from './trade.entity';
import { WaresService } from '../wares/wares.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateTradeDto, ExtRateTradeDto } from './trade.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { getDateMonthAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { TradeError } from './trade-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private tradesRepository: Repository<Trade>,
    private waresService: WaresService,
    private mqttService: MqttService,
  ) {}

  async getTradesStats(): Promise<Stats> {
    const current = await this.tradesRepository
      .createQueryBuilder('trade')
      .where('trade.createdAt >= :currentMonth', {
        currentMonth: getDateMonthAgo(1),
      })
      .getCount();
    const previous = await this.tradesRepository
      .createQueryBuilder('trade')
      .where('trade.createdAt >= :previousMonth', {
        previousMonth: getDateMonthAgo(2),
      })
      .getCount();
    return { current, previous: previous - current };
  }

  async getMyTrades(myId: number, req: Request): Promise<Response<Trade>> {
    const [result, count] = await this.getTradesQueryBuilder(req)
      .innerJoin('buyerCard.users', 'buyerUsers')
      .andWhere('buyerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getSelledTrades(myId: number, req: Request): Promise<Response<Trade>> {
    const [result, count] = await this.getTradesQueryBuilder(req)
      .innerJoin('sellerCard.users', 'sellerUsers')
      .andWhere('sellerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedTrades(myId: number, req: Request): Promise<Response<Trade>> {
    const [result, count] = await this.getTradesQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllTrades(req: Request): Promise<Response<Trade>> {
    const [result, count] = await this.getTradesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createTrade(dto: ExtCreateTradeDto): Promise<void> {
    await this.waresService.buyWare(dto);
    await this.create(dto);
  }

  async rateTrade(dto: ExtRateTradeDto): Promise<void> {
    const trade = await this.checkTradeOwner(
      dto.tradeId,
      dto.myId,
      dto.hasRole,
    );
    await this.rate(trade, dto.rate);
    this.mqttService.publishNotificationMessage(
      trade.ware.rent.card.userId,
      Notification.RATED_TRADE,
    );
  }

  async checkTradeExists(id: number): Promise<void> {
    await this.tradesRepository.findOneByOrFail({ id });
  }

  private async checkTradeOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Trade> {
    const trade = await this.tradesRepository.findOne({
      relations: ['card', 'card.users', 'ware', 'ware.rent', 'ware.rent.card'],
      where: { id },
    });
    if (!trade.card.users.map((user) => user.id).includes(userId) && !hasRole) {
      throw new AppException(TradeError.NOT_OWNER);
    }
    return trade;
  }

  private async create(dto: ExtCreateTradeDto): Promise<void> {
    try {
      const trade = this.tradesRepository.create({
        wareId: dto.wareId,
        cardId: dto.cardId,
        amount: dto.amount,
      });
      await this.tradesRepository.save(trade);
    } catch (error) {
      throw new AppException(TradeError.CREATE_FAILED);
    }
  }

  private async rate(trade: Trade, rate: number): Promise<void> {
    try {
      trade.rate = rate || null;
      await this.tradesRepository.save(trade);
    } catch (error) {
      throw new AppException(TradeError.RATE_FAILED);
    }
  }

  private getTradesQueryBuilder(req: Request): SelectQueryBuilder<Trade> {
    return this.tradesRepository
      .createQueryBuilder('trade')
      .innerJoin('trade.ware', 'ware')
      .innerJoin('ware.rent', 'rent')
      .innerJoin('rent.store', 'store')
      .innerJoin('store.market', 'market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('rent.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .innerJoin('trade.card', 'buyerCard')
      .innerJoin('buyerCard.user', 'buyerUser')
      .leftJoin('ware.states', 'state', 'state.createdAt < trade.createdAt')
      .leftJoin(
        'ware.states',
        'next',
        'state.createdAt < next.createdAt AND next.createdAt < trade.createdAt',
      )
      .where('next.id IS NULL')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.BUYER}`)
                  .andWhere('buyerUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.SELLER}`)
                  .andWhere('sellerUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.OWNER}`)
                  .andWhere('ownerUser.id = :userId'),
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
                  .where(`${!req.mode || req.mode == Mode.BUYER}`)
                  .andWhere('buyerCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.SELLER}`)
                  .andWhere('sellerCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.OWNER}`)
                  .andWhere('ownerCard.id = :cardId'),
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
            .orWhere('ware.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('ware.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('trade.rate = :rate', { rate: req.rate }),
        ),
      )
      .orderBy('trade.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'trade.id',
        'ware.id',
        'rent.id',
        'store.id',
        'market.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.name',
        'ownerCard.name',
        'ownerCard.color',
        'market.name',
        'market.x',
        'market.y',
        'store.name',
        'sellerCard.id',
        'sellerUser.id',
        'sellerUser.name',
        'sellerCard.name',
        'sellerCard.color',
        'ware.item',
        'ware.description',
        'ware.intake',
        'ware.kit',
        'state.price',
        'buyerCard.id',
        'buyerUser.id',
        'buyerUser.name',
        'buyerCard.name',
        'buyerCard.color',
        'trade.amount',
        'trade.createdAt',
        'trade.rate',
      ]);
  }
}
