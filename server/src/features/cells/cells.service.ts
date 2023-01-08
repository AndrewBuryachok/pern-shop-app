import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Cell } from './cell.entity';

@Injectable()
export class CellsService {
  constructor(
    @InjectRepository(Cell)
    private cellsRepository: Repository<Cell>,
  ) {}

  private getCellsQueryBuilder(): SelectQueryBuilder<Cell> {
    return this.cellsRepository
      .createQueryBuilder('cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .orderBy('cell.id', 'DESC')
      .select([
        'cell.id',
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
        'cell.name',
        'cell.reservedAt',
      ]);
  }
}
