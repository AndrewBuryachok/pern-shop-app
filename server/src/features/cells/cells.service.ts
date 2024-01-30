import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Cell } from './cell.entity';
import { StoragesService } from '../storages/storages.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateCellDto, ReserveCellDto } from './cell.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAfter } from '../../common/utils';
import { MAX_CELLS_NUMBER } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { CellError } from './cell-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class CellsService {
  constructor(
    @InjectRepository(Cell)
    private cellsRepository: Repository<Cell>,
    private storagesService: StoragesService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
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
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
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
    return this.selectCellsQueryBuilder(storageId).getMany();
  }

  async createCell(dto: ExtCreateCellDto & { nick: string }): Promise<void> {
    await this.storagesService.checkStorageOwner(
      dto.storageId,
      dto.myId,
      dto.hasRole,
    );
    const name = await this.checkHasNotEnough(dto.storageId);
    await this.create({ ...dto, name });
    this.mqttService.publishNotificationMessage(
      0,
      dto.nick,
      Notification.CREATED_CELL,
    );
  }

  async reserveCell(dto: ReserveCellDto & { nick: string }): Promise<Cell> {
    const cell = await this.findFreeCell(dto.storageId);
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: cell.storage.cardId,
      sum: cell.storage.price,
      description: '',
    });
    await this.reserve(cell);
    return cell;
  }

  async continueCell(dto: ReserveCellDto & { nick: string }): Promise<Cell> {
    const cell = await this.cellsRepository.findOne({
      relations: ['storage', 'storage.card'],
      where: { id: dto.storageId },
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: cell.storage.cardId,
      sum: cell.storage.price,
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
      .innerJoinAndSelect('storage.card', 'card')
      .where('storage.id = :storageId', { storageId })
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('cell.reservedUntil IS NULL')
            .orWhere('cell.reservedUntil < NOW()'),
        ),
      )
      .orderBy('RANDOM()')
      .getOne();
    if (!cell) {
      throw new AppException(CellError.NO_FREE);
    }
    return cell;
  }

  private async create(dto: ExtCreateCellDto): Promise<Cell> {
    try {
      const cell = this.cellsRepository.create({
        storageId: dto.storageId,
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

  private selectCellsQueryBuilder(storageId: number): SelectQueryBuilder<Cell> {
    return this.cellsRepository
      .createQueryBuilder('cell')
      .where('cell.storageId = :storageId', { storageId })
      .orderBy('cell.name', 'ASC')
      .select(['cell.id', 'cell.name']);
  }

  private getCellsQueryBuilder(req: Request): SelectQueryBuilder<Cell> {
    return this.cellsRepository
      .createQueryBuilder('cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
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
            .where(`${!req.cell}`)
            .orWhere('cell.id = :cellId', { cellId: req.cell }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('storage.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('storage.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .orderBy('cell.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'cell.id',
        'storage.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'ownerCard.name',
        'ownerCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'storage.price',
        'cell.name',
        'cell.reservedUntil',
      ]);
  }
}
