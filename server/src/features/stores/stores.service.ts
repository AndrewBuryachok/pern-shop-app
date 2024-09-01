import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Store } from './store.entity';
import { MarketTag } from '../markets-tags/market-tag.entity';
import { MarketsTagsService } from '../markets-tags/markets-tags.service';
import { PaymentsService } from '../payments/payments.service';
import { ExtCreateStoreDto, ReserveStoreDto } from './store.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAfter } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { StoreError } from './store-error.enum';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    private marketsTagsService: MarketsTagsService,
    private paymentsService: PaymentsService,
  ) {}

  async getMainStores(req: Request): Promise<Response<Store>> {
    const [result, count] = await this.getStoresQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('store.reservedUntil IS NULL')
            .orWhere('store.reservedUntil < NOW()'),
        ),
      )
      .getManyAndCount();
    return { result, count };
  }

  async getMyStores(myId: number, req: Request): Promise<Response<Store>> {
    const [result, count] = await this.getStoresQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllStores(req: Request): Promise<Response<Store>> {
    const [result, count] = await this.getStoresQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectMarketStores(marketId: number): Promise<Store[]> {
    return this.selectStoresQueryBuilder()
      .where('store.marketId = :marketId', { marketId })
      .getMany();
  }

  selectTagStores(marketTagId: number): Promise<Store[]> {
    return this.selectStoresQueryBuilder()
      .where('store.marketTagId = :marketTagId', { marketTagId })
      .getMany();
  }

  async selectStoreTag(storeId: number): Promise<MarketTag> {
    const store = await this.storesRepository
      .createQueryBuilder('store')
      .innerJoin('store.marketTag', 'tag')
      .where('store.id = :storeId', { storeId })
      .select(['store.id', 'tag.id', 'tag.name', 'tag.price'])
      .getOne();
    return store.marketTag;
  }

  async createStore(dto: ExtCreateStoreDto): Promise<void> {
    const { marketId } = await this.marketsTagsService.checkMarketTagOwner(
      dto.marketTagId,
      dto.myId,
      dto.hasRole,
    );
    const name = (await this.countMarketStores(marketId)) + 1;
    await this.create({ ...dto, marketId, name });
  }

  async reserveStore(dto: ReserveStoreDto & { nick: string }): Promise<Store> {
    const store = await this.findFreeStore(dto.storeId);
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: store.market.cardId,
      sum: store.marketTag.price,
      description: '',
    });
    await this.reserve(store);
    return store;
  }

  async continueStore(dto: ReserveStoreDto & { nick: string }): Promise<Store> {
    const store = await this.storesRepository.findOne({
      relations: ['market', 'market.card', 'marketTag'],
      where: { id: dto.storeId },
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: store.market.cardId,
      sum: store.marketTag.price,
      description: '',
    });
    await this.continue(store);
    return store;
  }

  async unreserveStore(id: number): Promise<Store> {
    const store = await this.storesRepository.findOne({
      relations: ['market', 'market.card'],
      where: { id },
    });
    await this.unreserve(store);
    return store;
  }

  async checkStoreExists(id: number): Promise<void> {
    await this.storesRepository.findOneByOrFail({ id });
  }

  private countMarketStores(marketId: number): Promise<number> {
    return this.storesRepository.countBy({ marketId });
  }

  private async findFreeStore(storeId: number): Promise<Store> {
    const store = await this.storesRepository
      .createQueryBuilder('store')
      .innerJoinAndSelect('store.market', 'market')
      .innerJoinAndSelect('market.card', 'card')
      .innerJoinAndSelect('store.marketTag', 'marketTag')
      .where('store.id = :storeId', { storeId })
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('store.reservedUntil IS NULL')
            .orWhere('store.reservedUntil < NOW()'),
        ),
      )
      .getOne();
    if (!store) {
      throw new AppException(StoreError.NOT_FREE);
    }
    return store;
  }

  private async create(dto: ExtCreateStoreDto): Promise<Store> {
    try {
      const store = this.storesRepository.create({
        marketId: dto.marketId,
        marketTagId: dto.marketTagId,
        name: dto.name,
      });
      await this.storesRepository.save(store);
      return store;
    } catch (error) {
      throw new AppException(StoreError.CREATE_FAILED);
    }
  }

  private async reserve(store: Store): Promise<void> {
    try {
      store.reservedUntil = getDateWeekAfter();
      await this.storesRepository.save(store);
    } catch (error) {
      throw new AppException(StoreError.RESERVE_FAILED);
    }
  }

  private async continue(store: Store): Promise<void> {
    try {
      store.reservedUntil.setDate(store.reservedUntil.getDate() + 7);
      await this.storesRepository.save(store);
    } catch (error) {
      throw new AppException(StoreError.CONTINUE_FAILED);
    }
  }

  private async unreserve(store: Store): Promise<void> {
    try {
      store.reservedUntil = new Date();
      await this.storesRepository.save(store);
    } catch (error) {
      throw new AppException(StoreError.UNRESERVE_FAILED);
    }
  }

  private selectStoresQueryBuilder(): SelectQueryBuilder<Store> {
    return this.storesRepository
      .createQueryBuilder('store')
      .orderBy('store.name', 'ASC')
      .select(['store.id', 'store.name']);
  }

  private getStoresQueryBuilder(req: Request): SelectQueryBuilder<Store> {
    return this.storesRepository
      .createQueryBuilder('store')
      .innerJoin('store.market', 'market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('store.marketTag', 'marketTag')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('store.id = :id', { id: req.id }),
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
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.marketTag}`).orWhere('marketTag.id = :marketTagId', {
            marketTagId: req.marketTag,
          }),
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
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('store.reservedUntil IS NULL')
            .orWhere('store.reservedUntil < NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('store.reservedUntil > NOW()'),
        ),
      )
      .orderBy('store.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'store.id',
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
        'marketTag.id',
        'marketTag.name',
        'marketTag.price',
        'store.name',
        'store.reservedUntil',
      ]);
  }
}
