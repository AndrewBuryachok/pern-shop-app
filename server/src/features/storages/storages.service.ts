import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Storage } from './storage.entity';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(Storage)
    private storagesRepository: Repository<Storage>,
  ) {}

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
