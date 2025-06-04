import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Market } from './market.entity';
import { CardsService } from '../cards/cards.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateMarketDto, ExtEditMarketDto } from './market.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { MarketError } from './market-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class MarketsService {
  constructor(
    @InjectRepository(Market)
    private marketsRepository: Repository<Market>,
    private cardsService: CardsService,
    private mqttService: MqttService,
  ) {}

  async getMainMarkets(req: Request): Promise<Response<Market>> {
    const [result, count] = await this.getMarketsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyMarkets(myId: number, req: Request): Promise<Response<Market>> {
    const [result, count] = await this.getMarketsQueryBuilder(req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllMarkets(req: Request): Promise<Response<Market>> {
    const [result, count] = await this.getMarketsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectMainMarkets(): Promise<Market[]> {
    return this.selectMarketsQueryBuilder().getMany();
  }

  selectMyMarkets(myId: number): Promise<Market[]> {
    return this.selectMarketsQueryBuilder()
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .loadRelationCountAndMap('market.stalls', 'market.stalls')
      .where('ownerCards.userId = :myId', { myId })
      .getMany();
  }

  selectAllMarkets(): Promise<Market[]> {
    return this.selectMarketsQueryBuilder()
      .loadRelationCountAndMap('market.stalls', 'market.stalls')
      .getMany();
  }

  async createMarket(dto: ExtCreateMarketDto): Promise<void> {
    const card = await this.cardsService.checkCardUser(
      dto.cardId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    const market = await this.create(dto);
    this.mqttService.publishNotification(
      market.id,
      0,
      card.userId,
      Notification.CREATED_MARKET,
    );
  }

  async editMarket(dto: ExtEditMarketDto): Promise<void> {
    const market = await this.checkMarketOwner(
      dto.marketId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(dto.name, dto.marketId);
    await this.checkCoordinatesNotUsed(dto.x, dto.y, dto.marketId);
    await this.edit(market, dto);
  }

  async checkMarketExists(id: number): Promise<void> {
    await this.marketsRepository.findOneByOrFail({ id });
  }

  async checkMarketOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Market> {
    const market = await this.marketsRepository.findOne({
      relations: ['card', 'card.account', 'card.account.cards'],
      where: { id, card: { account: { cards: { completedAt: IsNull() } } } },
    });
    const card = market.card.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(MarketError.NOT_OWNER);
    }
    return market;
  }

  private async checkNameNotUsed(name: string, id?: number): Promise<void> {
    const market = await this.marketsRepository.findOneBy({ name });
    if (market && (!id || market.id !== id)) {
      throw new AppException(MarketError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(
    x: number,
    y: number,
    id?: number,
  ): Promise<void> {
    const market = await this.marketsRepository.findOneBy({ x, y });
    if (market && (!id || market.id !== id)) {
      throw new AppException(MarketError.COORDINATES_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateMarketDto): Promise<Market> {
    try {
      const market = this.marketsRepository.create({
        cardId: dto.cardId,
        name: dto.name,
        description: dto.description,
        x: dto.x,
        y: dto.y,
      });
      await this.marketsRepository.save(market);
      return market;
    } catch (error) {
      throw new AppException(MarketError.CREATE_FAILED);
    }
  }

  private async edit(market: Market, dto: ExtEditMarketDto): Promise<void> {
    try {
      market.name = dto.name;
      market.description = dto.description;
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

  private getMarketsQueryBuilder(req: Request): SelectQueryBuilder<Market> {
    return this.marketsRepository
      .createQueryBuilder('market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .loadRelationCountAndMap('market.tags', 'market.tags')
      .loadRelationCountAndMap('market.stalls', 'market.stalls')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('market.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
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
      .orderBy('market.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'market.id',
        'ownerCard.id',
        'ownerAccount.id',
        'ownerAccount.name',
        'ownerAccount.color',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'market.name',
        'market.description',
        'market.x',
        'market.y',
        'market.createdAt',
      ]);
  }
}
