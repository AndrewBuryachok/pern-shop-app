import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Trade } from './trade.entity';
import { WaresService } from '../wares/wares.service';
import { ExtCreateTradeDto } from './trade.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { getDateMonthAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { TradeError } from './trade-error.enum';
import { Filter, Mode } from '../../common/enums';

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
        new Brackets((qb) =>
          qb.where('buyerUser.id = :myId').orWhere('sellerUser.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedTrades(myId: number, req: Request): Promise<Response<Trade>> {
    const [result, count] = await this.getTradesQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
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
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb.where(`${req.mode === Mode.SOME}`).andWhere(
                  new Brackets((qb) =>
                    qb
                      .where(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.BUYER)}`)
                            .andWhere('buyerUser.id = :userId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.SELLER)}`)
                            .andWhere('sellerUser.id = :userId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.OWNER)}`)
                            .andWhere('ownerUser.id = :userId'),
                        ),
                      ),
                  ),
                ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.EACH}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.BUYER)}`)
                        .orWhere('buyerUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.SELLER)}`)
                        .orWhere('sellerUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.OWNER)}`)
                        .orWhere('ownerUser.id = :userId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `buyerUser.id ${
                      req.filters.includes(Filter.BUYER) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `sellerUser.id ${
                      req.filters.includes(Filter.SELLER) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `ownerUser.id ${
                      req.filters.includes(Filter.OWNER) ? '=' : '!='
                    } :userId`,
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
                qb.where(`${req.mode === Mode.SOME}`).andWhere(
                  new Brackets((qb) =>
                    qb
                      .where(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.BUYER)}`)
                            .andWhere('buyerCard.id = :cardId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.SELLER)}`)
                            .andWhere('sellerCard.id = :cardId'),
                        ),
                      )
                      .orWhere(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.OWNER)}`)
                            .andWhere('ownerCard.id = :cardId'),
                        ),
                      ),
                  ),
                ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.EACH}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.BUYER)}`)
                        .orWhere('buyerCard.id = :cardId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.SELLER)}`)
                        .orWhere('sellerCard.id = :cardId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.OWNER)}`)
                        .orWhere('ownerCard.id = :cardId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `buyerCard.id ${
                      req.filters.includes(Filter.BUYER) ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `sellerCard.id ${
                      req.filters.includes(Filter.SELLER) ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `ownerCard.id ${
                      req.filters.includes(Filter.OWNER) ? '=' : '!='
                    } :cardId`,
                  ),
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
