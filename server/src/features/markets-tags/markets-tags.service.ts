import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { MarketTag } from './market-tag.entity';
import { MarketTagState } from './market-tag-state.entity';
import { MarketsService } from '../markets/markets.service';
import { ExtCreateMarketTagDto, ExtEditMarketTagDto } from './market-tag.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { MarketTagError } from './market-tag-error.enum';

@Injectable()
export class MarketsTagsService {
  constructor(
    @InjectRepository(MarketTag)
    private marketsTagsRepository: Repository<MarketTag>,
    @InjectRepository(MarketTagState)
    private marketsTagsStatesRepository: Repository<MarketTagState>,
    private marketsService: MarketsService,
  ) {}

  async getMainMarketsTags(req: Request): Promise<Response<MarketTag>> {
    const [result, count] = await this.getMarketsTagsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyMarketsTags(
    myId: number,
    req: Request,
  ): Promise<Response<MarketTag>> {
    const [result, count] = await this.getMarketsTagsQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllMarketsTags(req: Request): Promise<Response<MarketTag>> {
    const [result, count] = await this.getMarketsTagsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectMarketTags(marketId: number): Promise<MarketTag[]> {
    return this.selectMarketsTagsQueryBuilder()
      .where('marketTag.marketId = :marketId', { marketId })
      .getMany();
  }

  async selectMarketTagStates(marketTagId: number): Promise<MarketTagState[]> {
    const marketTag = await this.marketsTagsRepository
      .createQueryBuilder('marketTag')
      .leftJoin('marketTag.states', 'state')
      .where('marketTag.id = :marketTagId', { marketTagId })
      .orderBy('state.id', 'DESC')
      .select([
        'marketTag.id',
        'marketTag.price',
        'state.id',
        'state.price',
        'state.createdAt',
      ])
      .getOne();
    return marketTag.states;
  }

  async createMarketTag(dto: ExtCreateMarketTagDto): Promise<void> {
    await this.marketsService.checkMarketOwner(
      dto.marketId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(dto.marketId, dto.name);
    await this.create(dto);
  }

  async editMarketTag(dto: ExtEditMarketTagDto): Promise<void> {
    const marketTag = await this.checkMarketTagOwner(
      dto.marketTagId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(marketTag.marketId, dto.name, dto.marketTagId);
    await this.edit(marketTag, dto);
  }

  async checkMarketTagExists(id: number): Promise<void> {
    await this.marketsTagsRepository.findOneByOrFail({ id });
  }

  async checkMarketTagOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<MarketTag> {
    const marketTag = await this.marketsTagsRepository.findOne({
      relations: ['market', 'market.card', 'market.card.users'],
      where: { id },
    });
    if (
      !marketTag.market.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(MarketTagError.NOT_OWNER);
    }
    return marketTag;
  }

  private async checkNameNotUsed(
    marketId: number,
    name: string,
    id?: number,
  ): Promise<void> {
    const marketTag = await this.marketsTagsRepository.findOneBy({
      marketId,
      name,
    });
    if (marketTag && (!id || marketTag.id !== id)) {
      throw new AppException(MarketTagError.NAME_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateMarketTagDto): Promise<MarketTag> {
    try {
      const marketTag = this.marketsTagsRepository.create({
        marketId: dto.marketId,
        name: dto.name,
        price: dto.price,
      });
      await this.marketsTagsRepository.save(marketTag);
      const marketTagState = this.marketsTagsStatesRepository.create({
        marketTagId: marketTag.id,
        price: marketTag.price,
      });
      await this.marketsTagsStatesRepository.save(marketTagState);
      return marketTag;
    } catch (error) {
      throw new AppException(MarketTagError.CREATE_FAILED);
    }
  }

  private async edit(
    marketTag: MarketTag,
    dto: ExtEditMarketTagDto,
  ): Promise<void> {
    try {
      const equal = marketTag.price === dto.price;
      marketTag.name = dto.name;
      marketTag.price = dto.price;
      await this.marketsTagsRepository.save(marketTag);
      if (!equal) {
        const marketTagState = this.marketsTagsStatesRepository.create({
          marketTagId: marketTag.id,
          price: marketTag.price,
        });
        await this.marketsTagsStatesRepository.save(marketTagState);
      }
    } catch (error) {
      throw new AppException(MarketTagError.EDIT_FAILED);
    }
  }

  private selectMarketsTagsQueryBuilder(): SelectQueryBuilder<MarketTag> {
    return this.marketsTagsRepository
      .createQueryBuilder('marketTag')
      .orderBy('marketTag.name', 'ASC')
      .select(['marketTag.id', 'marketTag.name', 'marketTag.price']);
  }

  private getMarketsTagsQueryBuilder(
    req: Request,
  ): SelectQueryBuilder<MarketTag> {
    return this.marketsTagsRepository
      .createQueryBuilder('marketTag')
      .innerJoin('marketTag.market', 'market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .loadRelationCountAndMap('marketTag.stalls', 'marketTag.stalls')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('marketTag.id = :id', { id: req.id }),
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
          qb.where(`${!req.market}`).orWhere('market.id = :marketId', {
            marketId: req.market,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.marketTag}`).orWhere('marketTag.id = :marketTagId', {
            marketTagId: req.marketTag,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.minPrice}`).orWhere('marketTag.price >= :minPrice', {
            minPrice: req.minPrice,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxPrice}`).orWhere('marketTag.price <= :maxPrice', {
            maxPrice: req.maxPrice,
          }),
        ),
      )
      .orderBy('marketTag.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'marketTag.id',
        'market.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'ownerCard.name',
        'ownerCard.color',
        'market.name',
        'market.x',
        'market.y',
        'marketTag.name',
        'marketTag.price',
        'marketTag.createdAt',
      ]);
  }
}
