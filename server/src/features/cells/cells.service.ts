import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Cell } from './cell.entity';
import { StoragesService } from '../storages/storages.service';
import { PaymentsService } from '../payments/payments.service';
import { ExtCreateCellDto, ReserveCellDto } from './cell.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAgo } from '../../common/utils';
import { MAX_CELLS_NUMBER } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { CellError } from './cell-error.enum';

@Injectable()
export class CellsService {
  constructor(
    @InjectRepository(Cell)
    private cellsRepository: Repository<Cell>,
    private storagesService: StoragesService,
    private paymentsService: PaymentsService,
  ) {}

  async getMainCells(req: Request): Promise<Response<Cell>> {
    const [result, count] = await this.getCellsQueryBuilder(req)
      .andWhere('(cell.reservedAt IS NULL OR cell.reservedAt < :date)', {
        date: getDateWeekAgo(),
      })
      .getManyAndCount();
    return { result, count };
  }

  async getMyCells(myId: number, req: Request): Promise<Response<Cell>> {
    const [result, count] = await this.getCellsQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllCells(req: Request): Promise<Response<Cell>> {
    const [result, count] = await this.getCellsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createCell(dto: ExtCreateCellDto): Promise<void> {
    await this.storagesService.checkStorageOwner(dto.storageId, dto.myId);
    const name = await this.checkHasNotEnough(dto.storageId);
    await this.create({ ...dto, name });
  }

  async reserveCell(dto: ReserveCellDto): Promise<number> {
    const cell = await this.findFreeCell(dto.storageId);
    await this.paymentsService.createPayment({
      myId: dto.myId,
      senderCardId: dto.cardId,
      receiverCardId: cell.storage.cardId,
      sum: cell.storage.price,
      description: 'reserve cell',
    });
    await this.reserve(cell);
    return cell.id;
  }

  private async checkHasNotEnough(storageId: number): Promise<number> {
    const count = await this.cellsRepository.countBy({ storageId });
    if (count === MAX_CELLS_NUMBER) {
      throw new AppException(CellError.ALREADY_HAS_ENOUGH);
    }
    return count + 1;
  }

  private async findFreeCell(storageId: number): Promise<Cell> {
    const cell = await this.cellsRepository
      .createQueryBuilder('cell')
      .innerJoinAndSelect('cell.storage', 'storage')
      .where(
        'storage.id = :storageId AND (cell.reservedAt IS NULL OR cell.reservedAt < :reservedAt)',
        { storageId, reservedAt: getDateWeekAgo() },
      )
      .getOne();
    if (!cell) {
      throw new AppException(CellError.NO_FREE);
    }
    return cell;
  }

  private async create(dto: ExtCreateCellDto): Promise<void> {
    try {
      const cell = this.cellsRepository.create({
        storageId: dto.storageId,
        name: dto.name,
      });
      await this.cellsRepository.save(cell);
    } catch (error) {
      throw new AppException(CellError.CREATE_FAILED);
    }
  }

  private async reserve(cell: Cell): Promise<void> {
    try {
      cell.reservedAt = new Date();
      await this.cellsRepository.save(cell);
    } catch (error) {
      throw new AppException(CellError.RESERVE_FAILED);
    }
  }

  private getCellsQueryBuilder(req: Request): SelectQueryBuilder<Cell> {
    return this.cellsRepository
      .createQueryBuilder('cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .where('ownerUser.name ILIKE :search', {
        search: `%${req.search || ''}%`,
      })
      .orderBy('cell.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
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
