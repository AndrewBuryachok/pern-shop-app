import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Storage } from './storage.entity';
import { getDateWeekAgo } from '../../common/utils';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(Storage)
    private storagesRepository: Repository<Storage>,
  ) {}

  getMainStorages(): Promise<Storage[]> {
    return this.getStoragesQueryBuilder().getMany();
  }

  getMyStorages(myId: number): Promise<Storage[]> {
    return this.getStoragesQueryBuilder()
      .where('ownerUser.id = :myId', { myId })
      .getMany();
  }

  getAllStorages(): Promise<Storage[]> {
    return this.getStoragesQueryBuilder().getMany();
  }

  selectMyStorages(myId: number): Promise<Storage[]> {
    return this.selectStoragesQueryBuilder()
      .innerJoin('storage.card', 'ownerCard')
      .loadRelationCountAndMap('storage.cells', 'storage.cells')
      .where('ownerCard.userId = :myId', { myId })
      .getMany();
  }

  selectFreeStorages(): Promise<Storage[]> {
    return this.selectStoragesQueryBuilder()
      .loadRelationCountAndMap(
        'storage.cellsCount',
        'storage.cells',
        'cell',
        (qb) =>
          qb.where('cell.reservedAt IS NULL OR cell.reservedAt > :reservedAt', {
            reservedAt: getDateWeekAgo(),
          }),
      )
      .addSelect(['storage.price'])
      .getMany()
      .then((storages) =>
        storages.filter((storage) => storage['cellsCount'] > 0),
      );
  }

  async checkStorageExists(id: number): Promise<void> {
    await this.storagesRepository.findOneByOrFail({ id });
  }

  private selectStoragesQueryBuilder(): SelectQueryBuilder<Storage> {
    return this.storagesRepository
      .createQueryBuilder('storage')
      .orderBy('storage.name', 'ASC')
      .select(['storage.id', 'storage.name', 'storage.x', 'storage.y']);
  }

  private getStoragesQueryBuilder(): SelectQueryBuilder<Storage> {
    return this.storagesRepository
      .createQueryBuilder('storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .leftJoinAndMapMany(
        'storage.cells',
        'cells',
        'cell',
        'storage.id = cell.storageId',
      )
      .orderBy('storage.id', 'DESC')
      .addOrderBy('cell.id', 'ASC')
      .select([
        'storage.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.name',
        'ownerCard.name',
        'ownerCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'storage.price',
        'cell.id',
        'cell.name',
      ]);
  }
}
