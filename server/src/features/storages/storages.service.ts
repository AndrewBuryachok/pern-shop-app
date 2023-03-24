import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Storage } from './storage.entity';
import { CardsService } from '../cards/cards.service';
import { ExtCreateStorageDto, ExtEditStorageDto } from './storage.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAgo } from '../../common/utils';
import { MAX_STORAGES_NUMBER } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { StorageError } from './storage-error.enum';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(Storage)
    private storagesRepository: Repository<Storage>,
    private cardsService: CardsService,
  ) {}

  async getMainStorages(req: Request): Promise<Response<Storage>> {
    const [result, count] = await this.getStoragesQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadCells(result);
    return { result, count };
  }

  async getMyStorages(myId: number, req: Request): Promise<Response<Storage>> {
    const [result, count] = await this.getStoragesQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    await this.loadCells(result);
    return { result, count };
  }

  async getAllStorages(req: Request): Promise<Response<Storage>> {
    const [result, count] = await this.getStoragesQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadCells(result);
    return { result, count };
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
          qb
            .where('cell.reservedAt IS NULL')
            .orWhere('cell.reservedAt < :date', {
              date: getDateWeekAgo(),
            }),
      )
      .addSelect(['storage.price'])
      .getMany()
      .then((storages) =>
        storages.filter((storage) => storage['cellsCount'] > 0),
      );
  }

  async createStorage(dto: ExtCreateStorageDto): Promise<void> {
    await this.cardsService.checkCardOwner(dto.cardId, dto.myId);
    await this.checkHasNotEnough(dto.myId);
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    await this.create(dto);
  }

  async editStorage(dto: ExtEditStorageDto): Promise<void> {
    const storage = await this.checkStorageOwner(dto.storageId, dto.myId);
    await this.edit(storage, dto);
  }

  async checkStorageExists(id: number): Promise<void> {
    await this.storagesRepository.findOneByOrFail({ id });
  }

  async checkStorageOwner(id: number, userId: number): Promise<Storage> {
    const storage = await this.storagesRepository.findOneBy({
      id,
      card: { userId },
    });
    if (!storage) {
      throw new AppException(StorageError.NOT_OWNER);
    }
    return storage;
  }

  private async checkHasNotEnough(userId: number): Promise<void> {
    const count = await this.storagesRepository.countBy({ card: { userId } });
    if (count === MAX_STORAGES_NUMBER) {
      throw new AppException(StorageError.ALREADY_HAS_ENOUGH);
    }
  }

  private async checkNameNotUsed(name: string): Promise<void> {
    const storage = await this.storagesRepository.findOneBy({ name });
    if (storage) {
      throw new AppException(StorageError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(x: number, y: number): Promise<void> {
    const storage = await this.storagesRepository.findOneBy({ x, y });
    if (storage) {
      throw new AppException(StorageError.COORDINATES_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateStorageDto): Promise<void> {
    try {
      const storage = this.storagesRepository.create({
        cardId: dto.cardId,
        name: dto.name,
        x: dto.x,
        y: dto.y,
        price: dto.price,
      });
      await this.storagesRepository.save(storage);
    } catch (error) {
      throw new AppException(StorageError.CREATE_FAILED);
    }
  }

  private async edit(storage: Storage, dto: ExtEditStorageDto): Promise<void> {
    try {
      storage.name = dto.name;
      storage.x = dto.x;
      storage.y = dto.y;
      await this.storagesRepository.save(storage);
    } catch (error) {
      throw new AppException(StorageError.EDIT_FAILED);
    }
  }

  private selectStoragesQueryBuilder(): SelectQueryBuilder<Storage> {
    return this.storagesRepository
      .createQueryBuilder('storage')
      .orderBy('storage.name', 'ASC')
      .select(['storage.id', 'storage.name', 'storage.x', 'storage.y']);
  }

  private async loadCells(storages: Storage[]): Promise<void> {
    const promises = storages.map(async (storage) => {
      storage['cells'] = (
        await this.storagesRepository
          .createQueryBuilder('storage')
          .leftJoinAndMapMany(
            'storage.cells',
            'cells',
            'cell',
            'storage.id = cell.storageId',
          )
          .where('storage.id = :storageId', { storageId: storage.id })
          .orderBy('cell.id', 'ASC')
          .select(['storage.id', 'cell.id', 'cell.name'])
          .getOne()
      )['cells'];
    });
    await Promise.all(promises);
  }

  private getStoragesQueryBuilder(req: Request): SelectQueryBuilder<Storage> {
    return this.storagesRepository
      .createQueryBuilder('storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere('ownerUser.id = :userId', { userId: req.user }),
        ),
      )
      .andWhere('storage.name ILIKE :name', { name: `%${req.name}%` })
      .orderBy('storage.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'storage.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.name',
        'ownerUser.status',
        'ownerCard.name',
        'ownerCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'storage.price',
      ]);
  }
}
