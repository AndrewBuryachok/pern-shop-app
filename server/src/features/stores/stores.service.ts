import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Store } from './store.entity';
import { MarketsService } from '../markets/markets.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateStoreDto, ReserveStoreDto } from './store.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAgo } from '../../common/utils';
import { MAX_STORES_NUMBER } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { StoreError } from './store-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
    private marketsService: MarketsService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  async getMainStores(req: Request): Promise<Response<Store>> {
    const [result, count] = await this.getStoresQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('store.reservedAt IS NULL')
            .orWhere('store.reservedAt < :date', {
              date: getDateWeekAgo(),
            }),
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
    return this.selectStoresQueryBuilder(marketId).getMany();
  }

  async createStore(dto: ExtCreateStoreDto): Promise<void> {
    await this.marketsService.checkMarketOwner(
      dto.marketId,
      dto.myId,
      dto.hasRole,
    );
    const name = await this.checkHasNotEnough(dto.marketId);
    await this.create({ ...dto, name });
  }

  async reserveStore(dto: ReserveStoreDto): Promise<void> {
    const store = await this.findFreeStore(dto.storeId);
    await this.paymentsService.createPayment({
      myId: dto.myId,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: store.market.cardId,
      sum: store.market.price,
      description: 'reserve store',
    });
    await this.reserve(store);
    this.mqttService.publishNotificationMessage(
      store.market.card.userId,
      Notification.CREATED_RENT,
    );
  }

  async unreserveStore(id: number): Promise<void> {
    const store = await this.storesRepository.findOneBy({ id });
    await this.unreserve(store);
  }

  async checkStoreExists(id: number): Promise<void> {
    await this.storesRepository.findOneByOrFail({ id });
  }

  private async checkHasNotEnough(marketId: number): Promise<number> {
    const count = await this.storesRepository.countBy({ marketId });
    if (count === MAX_STORES_NUMBER) {
      throw new AppException(StoreError.ALREADY_HAS_ENOUGH);
    }
    return count + 1;
  }

  private async findFreeStore(storeId: number): Promise<Store> {
    const store = await this.storesRepository
      .createQueryBuilder('store')
      .innerJoinAndSelect('store.market', 'market')
      .innerJoinAndSelect('market.card', 'card')
      .where('store.id = :storeId', { storeId })
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('store.reservedAt IS NULL')
            .orWhere('store.reservedAt < :date', { date: getDateWeekAgo() }),
        ),
      )
      .getOne();
    if (!store) {
      throw new AppException(StoreError.NOT_FREE);
    }
    return store;
  }

  private async create(dto: ExtCreateStoreDto): Promise<void> {
    try {
      const store = this.storesRepository.create({
        marketId: dto.marketId,
        name: dto.name,
      });
      await this.storesRepository.save(store);
    } catch (error) {
      throw new AppException(StoreError.CREATE_FAILED);
    }
  }

  private async reserve(store: Store): Promise<void> {
    try {
      store.reservedAt = new Date();
      await this.storesRepository.save(store);
    } catch (error) {
      throw new AppException(StoreError.RESERVE_FAILED);
    }
  }

  private async unreserve(store: Store): Promise<void> {
    try {
      store.reservedAt = null;
      await this.storesRepository.save(store);
    } catch (error) {
      throw new AppException(StoreError.UNRESERVE_FAILED);
    }
  }

  private selectStoresQueryBuilder(
    marketId: number,
  ): SelectQueryBuilder<Store> {
    return this.storesRepository
      .createQueryBuilder('store')
      .where('store.marketId = :marketId', { marketId })
      .orderBy('store.name', 'ASC')
      .select(['store.id', 'store.name']);
  }

  private getStoresQueryBuilder(req: Request): SelectQueryBuilder<Store> {
    return this.storesRepository
      .createQueryBuilder('store')
      .innerJoin('store.market', 'market')
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
            .where(`${!req.store}`)
            .orWhere('store.id = :storeId', { storeId: req.store }),
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
        'ownerUser.name',
        'ownerCard.name',
        'ownerCard.color',
        'market.name',
        'market.x',
        'market.y',
        'market.price',
        'store.name',
        'store.reservedAt',
      ]);
  }
}
