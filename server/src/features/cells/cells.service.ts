import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Cell } from './cell.entity';
import { StorageTag } from '../storages-tags/storage-tag.entity';
import { StoragesTagsService } from '../storages-tags/storages-tags.service';
import { PaymentsService } from '../payments/payments.service';
import { ExtCreateCellDto, ReserveCellDto } from './cell.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAfter } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { CellError } from './cell-error.enum';

@Injectable()
export class CellsService {
  constructor(
    @InjectRepository(Cell)
    private cellsRepository: Repository<Cell>,
    private storagesTagsService: StoragesTagsService,
    private paymentsService: PaymentsService,
  ) {}

  async getMainCells(req: Request): Promise<Response<Cell>> {
    const [result, count] = await this.getCellsQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('cell.reservedUntil IS NULL')
            .orWhere('cell.reservedUntil < NOW()'),
        ),
      )
      .getManyAndCount();
    return { result, count };
  }

  async getMyCells(myId: number, req: Request): Promise<Response<Cell>> {
    const [result, count] = await this.getCellsQueryBuilder(req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllCells(req: Request): Promise<Response<Cell>> {
    const [result, count] = await this.getCellsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectStorageCells(storageId: number): Promise<Cell[]> {
    return this.selectCellsQueryBuilder()
      .where('cell.storageId = :storageId', { storageId })
      .getMany();
  }

  selectTagCells(storageTagId: number): Promise<Cell[]> {
    return this.selectCellsQueryBuilder()
      .where('cell.storageTagId = :storageTagId', { storageTagId })
      .getMany();
  }

  async selectCellTag(cellId: number): Promise<StorageTag> {
    const cell = await this.cellsRepository
      .createQueryBuilder('cell')
      .innerJoin('cell.storageTag', 'tag')
      .where('cell.id = :cellId', { cellId })
      .select(['cell.id', 'tag.id', 'tag.name', 'tag.price'])
      .getOne();
    return cell.storageTag;
  }

  async createCell(dto: ExtCreateCellDto): Promise<void> {
    const { storageId } = await this.storagesTagsService.checkStorageTagOwner(
      dto.storageTagId,
      dto.myId,
      dto.hasRole,
    );
    const name = (await this.countStorageCells(storageId)) + 1;
    await this.create({ ...dto, storageId, name });
  }

  async reserveCell(dto: ReserveCellDto & { nick: string }): Promise<Cell> {
    const cell = await this.findFreeCell(dto.cellId);
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: cell.storage.cardId,
      sum: cell.storageTag.price,
      description: '',
    });
    await this.reserve(cell);
    return cell;
  }

  async continueCell(dto: ReserveCellDto & { nick: string }): Promise<Cell> {
    const cell = await this.cellsRepository.findOne({
      relations: ['storage', 'storage.card', 'storageTag'],
      where: { id: dto.cellId },
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: cell.storage.cardId,
      sum: cell.storageTag.price,
      description: '',
    });
    await this.continue(cell);
    return cell;
  }

  async unreserveCell(id: number): Promise<Cell> {
    const cell = await this.cellsRepository.findOne({
      relations: ['storage', 'storage.card'],
      where: { id },
    });
    await this.unreserve(cell);
    return cell;
  }

  async checkCellExists(id: number): Promise<void> {
    await this.cellsRepository.findOneByOrFail({ id });
  }

  private countStorageCells(storageId: number): Promise<number> {
    return this.cellsRepository.countBy({ storageId });
  }

  private async findFreeCell(cellId: number): Promise<Cell> {
    const cell = await this.cellsRepository
      .createQueryBuilder('cell')
      .innerJoinAndSelect('cell.storage', 'storage')
      .innerJoinAndSelect('storage.card', 'card')
      .innerJoinAndSelect('cell.storageTag', 'storageTag')
      .where('cell.id = :cellId', { cellId })
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('cell.reservedUntil IS NULL')
            .orWhere('cell.reservedUntil < NOW()'),
        ),
      )
      .getOne();
    if (!cell) {
      throw new AppException(CellError.NOT_FREE);
    }
    return cell;
  }

  private async create(dto: ExtCreateCellDto): Promise<Cell> {
    try {
      const cell = this.cellsRepository.create({
        storageId: dto.storageId,
        storageTagId: dto.storageTagId,
        name: dto.name,
      });
      await this.cellsRepository.save(cell);
      return cell;
    } catch (error) {
      throw new AppException(CellError.CREATE_FAILED);
    }
  }

  private async reserve(cell: Cell): Promise<void> {
    try {
      cell.reservedUntil = getDateWeekAfter();
      await this.cellsRepository.save(cell);
    } catch (error) {
      throw new AppException(CellError.RESERVE_FAILED);
    }
  }

  private async continue(cell: Cell): Promise<void> {
    try {
      cell.reservedUntil.setDate(cell.reservedUntil.getDate() + 7);
      await this.cellsRepository.save(cell);
    } catch (error) {
      throw new AppException(CellError.CONTINUE_FAILED);
    }
  }

  private async unreserve(cell: Cell): Promise<void> {
    try {
      cell.reservedUntil = new Date();
      await this.cellsRepository.save(cell);
    } catch (error) {
      throw new AppException(CellError.UNRESERVE_FAILED);
    }
  }

  private selectCellsQueryBuilder(): SelectQueryBuilder<Cell> {
    return this.cellsRepository
      .createQueryBuilder('cell')
      .orderBy('cell.name', 'ASC')
      .select(['cell.id', 'cell.name']);
  }

  private getCellsQueryBuilder(req: Request): SelectQueryBuilder<Cell> {
    return this.cellsRepository
      .createQueryBuilder('cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('cell.storageTag', 'storageTag')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('cell.id = :id', { id: req.id }),
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
            .where(`${!req.storage}`)
            .orWhere('storage.id = :storageId', { storageId: req.storage }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.storageTag}`)
            .orWhere('storageTag.id = :storageTagId', {
              storageTagId: req.storageTag,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.cell}`)
            .orWhere('cell.id = :cellId', { cellId: req.cell }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('storageTag.price >= :minPrice', {
              minPrice: req.minPrice,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('storageTag.price <= :maxPrice', {
              maxPrice: req.maxPrice,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('cell.reservedUntil IS NULL')
            .orWhere('cell.reservedUntil < NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('cell.reservedUntil > NOW()'),
        ),
      )
      .orderBy('cell.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'cell.id',
        'storage.id',
        'ownerCard.id',
        'ownerAccount.id',
        'ownerAccount.name',
        'ownerAccount.color',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'storage.name',
        'storage.x',
        'storage.y',
        'storageTag.id',
        'storageTag.name',
        'storageTag.price',
        'cell.name',
        'cell.reservedUntil',
      ]);
  }
}
