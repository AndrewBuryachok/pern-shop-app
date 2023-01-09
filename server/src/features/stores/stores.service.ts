import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Store } from './store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private storesRepository: Repository<Store>,
  ) {}

  getMainStores(): Promise<Store[]> {
    return this.getStoresQueryBuilder().getMany();
  }

  getMyStores(myId: number): Promise<Store[]> {
    return this.getStoresQueryBuilder()
      .where('ownerUser.id = :myId', { myId })
      .getMany();
  }

  getAllStores(): Promise<Store[]> {
    return this.getStoresQueryBuilder().getMany();
  }

  async checkStoreExists(id: number): Promise<void> {
    await this.storesRepository.findOneByOrFail({ id });
  }

  private getStoresQueryBuilder(): SelectQueryBuilder<Store> {
    return this.storesRepository
      .createQueryBuilder('store')
      .innerJoin('store.market', 'market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .orderBy('store.id', 'DESC')
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
