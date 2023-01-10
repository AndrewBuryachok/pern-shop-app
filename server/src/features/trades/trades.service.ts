import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Trade } from './trade.entity';
import { WaresService } from '../wares/wares.service';
import { ExtCreateTradeDto } from './trade.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { TradeError } from './trade-error.enum';

@Injectable()
export class TradesService {
  constructor(
    @InjectRepository(Trade)
    private tradesRepository: Repository<Trade>,
    private waresService: WaresService,
  ) {}

  async getMyTrades(myId: number, req: Request): Promise<Response<Trade>> {
    const [result, count] = await this.getTradesQueryBuilder(req)
      .andWhere('(buyerUser.id = :myId OR sellerUser.id = :myId)', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedTrades(myId: number, req: Request): Promise<Response<Trade>> {
    const [result, count] = await this.getTradesQueryBuilder(req)
      .innerJoin('market.card', 'ownerCard')
      .andWhere('ownerCard.userId = :myId', { myId })
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
      .innerJoin('rent.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .innerJoin('trade.card', 'buyerCard')
      .innerJoin('buyerCard.user', 'buyerUser')
      .where(
        '(buyerUser.name ILIKE :search OR sellerUser.name ILIKE :search)',
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
        'ware.price',
        'buyerCard.id',
        'buyerUser.id',
        'buyerUser.name',
        'buyerCard.name',
        'buyerCard.color',
        'trade.amount',
        'trade.createdAt',
      ]);
  }
}
