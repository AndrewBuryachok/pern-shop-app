import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Trade } from './trade.entity';
import { WaresService } from '../wares/wares.service';
import { ExtCreateTradeDto } from './trade.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { getDateMonthAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { TradeError } from './trade-error.enum';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private tradesRepository: Repository<Trade>,
    private waresService: WaresService,
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
      .andWhere(
        '(ownerUser.id = :myId OR buyerUser.id = :myId OR sellerUser.id = :myId)',
        { myId },
      )
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
      .where(
        '(ownerUser.name ILIKE :search OR buyerUser.name ILIKE :search OR sellerUser.name ILIKE :search)',
        { search: `%${req.search || ''}%` },
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
        'ownerUser.status',
        'ownerCard.name',
        'ownerCard.color',
        'market.name',
        'market.x',
        'market.y',
        'store.name',
        'sellerCard.id',
        'sellerUser.id',
        'sellerUser.name',
        'sellerUser.status',
        'sellerCard.name',
        'sellerCard.color',
        'ware.item',
        'ware.description',
        'ware.intake',
        'ware.kit',
        'ware.price',
        'buyerCard.id',
        'buyerUser.id',
        'buyerUser.name',
        'buyerUser.status',
        'buyerCard.name',
        'buyerCard.color',
        'trade.amount',
        'trade.createdAt',
      ]);
  }
}
