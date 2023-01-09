import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Storage } from './storage.entity';
import { CardsService } from '../cards/cards.service';
import { ExtCreateStorageDto, ExtEditStorageDto } from './storage.dto';
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
