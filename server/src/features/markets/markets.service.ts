import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Market } from './market.entity';
import { CardsService } from '../cards/cards.service';
import { ExtCreateMarketDto, ExtEditMarketDto } from './market.dto';
import { Request, Response } from '../../common/interfaces';
import { MAX_MARKETS_NUMBER } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { MarketError } from './market-error.enum';

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(Market)
    private marketsRepository: Repository<Market>,
    private cardsService: CardsService,
  ) {}

  async getMainMarkets(req: Request): Promise<Response<Market>> {
    const [result, count] = await this.getMarketsQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadStores(result);
    return { result, count };
  }

  async getMyMarkets(myId: number, req: Request): Promise<Response<Market>> {
    const [result, count] = await this.getMarketsQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    await this.loadStores(result);
    return { result, count };
  }

  async getAllMarkets(req: Request): Promise<Response<Market>> {
    const [result, count] = await this.getMarketsQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadStores(result);
    return { result, count };
  }

  selectAllMarkets(): Promise<Market[]> {
    return this.selectMarketsQueryBuilder()
      .addSelect('market.cardId')
      .getMany();
  }

  selectMyMarkets(myId: number): Promise<Market[]> {
    return this.selectMarketsQueryBuilder()
      .innerJoin('market.card', 'ownerCard')
      .loadRelationCountAndMap('market.stores', 'market.stores')
      .where('ownerCard.userId = :myId', { myId })
      .getMany();
  }

  async createMarket(dto: ExtCreateMarketDto): Promise<void> {
    await this.cardsService.checkCardOwner(dto.cardId, dto.myId);
    await this.checkHasNotEnough(dto.myId);
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    await this.create(dto);
  }

  async editMarket(dto: ExtEditMarketDto): Promise<void> {
    const market = await this.checkMarketOwner(dto.marketId, dto.myId);
    await this.edit(market, dto);
  }

  async checkMarketExists(id: number): Promise<void> {
    await this.marketsRepository.findOneByOrFail({ id });
  }

  async checkMarketOwner(id: number, userId: number): Promise<Market> {
    const market = await this.marketsRepository.findOneBy({
      id,
      card: { userId },
    });
    if (!market) {
      throw new AppException(MarketError.NOT_OWNER);
    }
    return market;
  }

  private async checkHasNotEnough(userId: number): Promise<void> {
    const count = await this.marketsRepository.countBy({ card: { userId } });
    if (count === MAX_MARKETS_NUMBER) {
      throw new AppException(MarketError.ALREADY_HAS_ENOUGH);
    }
  }

  private async checkNameNotUsed(name: string): Promise<void> {
    const market = await this.marketsRepository.findOneBy({ name });
    if (market) {
      throw new AppException(MarketError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(x: number, y: number): Promise<void> {
    const market = await this.marketsRepository.findOneBy({ x, y });
    if (market) {
      throw new AppException(MarketError.COORDINATES_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateMarketDto): Promise<void> {
    try {
      const market = this.marketsRepository.create({
        cardId: dto.cardId,
        name: dto.name,
        x: dto.x,
        y: dto.y,
        price: dto.price,
      });
      await this.marketsRepository.save(market);
    } catch (error) {
      throw new AppException(MarketError.CREATE_FAILED);
    }
  }

  private async edit(market: Market, dto: ExtEditMarketDto): Promise<void> {
    try {
      market.name = dto.name;
      market.x = dto.x;
      market.y = dto.y;
      await this.marketsRepository.save(market);
    } catch (error) {
      throw new AppException(MarketError.EDIT_FAILED);
    }
  }

  private selectMarketsQueryBuilder(): SelectQueryBuilder<Market> {
    return this.marketsRepository
      .createQueryBuilder('market')
      .orderBy('market.name', 'ASC')
      .select(['market.id', 'market.name', 'market.x', 'market.y']);
  }

  private async loadStores(markets: Market[]): Promise<void> {
    const promises = markets.map(async (market) => {
      market['stores'] = (
        await this.marketsRepository
          .createQueryBuilder('market')
          .leftJoinAndMapMany(
            'market.stores',
            'stores',
            'store',
            'market.id = store.marketId',
          )
          .where('market.id = :marketId', { marketId: market.id })
          .orderBy('store.id', 'DESC')
          .select(['market.id', 'store.id', 'store.name'])
          .getOne()
      )['stores'];
    });
    await Promise.all(promises);
  }

  private getMarketsQueryBuilder(req: Request): SelectQueryBuilder<Market> {
    return this.marketsRepository
      .createQueryBuilder('market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere('ownerUser.id = :userId', { userId: req.user }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.card}`)
            .orWhere('ownerCard.id = :cardId', { cardId: req.card }),
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
            .where(`${!req.name}`)
            .orWhere('market.name ILIKE :name', { name: req.name }),
        ),
      )
      .orderBy('market.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
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
        'market.price',
      ]);
  }
}
