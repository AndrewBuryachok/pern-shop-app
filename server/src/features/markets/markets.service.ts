import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Market } from './market.entity';
import { CardsService } from '../cards/cards.service';
import { ExtCreateMarketDto, ExtEditMarketDto } from './market.dto';
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

  getMainMarkets(): Promise<Market[]> {
    return this.getMarketsQueryBuilder().getMany();
  }

  getMyMarkets(myId: number): Promise<Market[]> {
    return this.getMarketsQueryBuilder()
      .where('ownerUser.id = :myId', { myId })
      .getMany();
  }

  getAllMarkets(): Promise<Market[]> {
    return this.getMarketsQueryBuilder().getMany();
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

  private getMarketsQueryBuilder(): SelectQueryBuilder<Market> {
    return this.marketsRepository
      .createQueryBuilder('market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .leftJoinAndMapMany(
        'market.stores',
        'stores',
        'store',
        'market.id = store.marketId',
      )
      .orderBy('market.id', 'DESC')
      .addOrderBy('store.id', 'ASC')
      .select([
        'market.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.name',
        'ownerCard.name',
        'ownerCard.color',
        'market.name',
        'market.x',
        'market.y',
        'market.price',
        'store.id',
        'store.name',
      ]);
  }
}
