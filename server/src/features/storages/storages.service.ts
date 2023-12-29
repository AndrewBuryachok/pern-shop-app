import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Storage } from './storage.entity';
import { StorageState } from './storage-state.entity';
import { CardsService } from '../cards/cards.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateStorageDto, ExtEditStorageDto } from './storage.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAgo } from '../../common/utils';
import { MAX_STORAGES_NUMBER } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { StorageError } from './storage-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(Storage)
    private storagesRepository: Repository<Storage>,
    @InjectRepository(StorageState)
    private storagesStatesRepository: Repository<StorageState>,
    private cardsService: CardsService,
    private mqttService: MqttService,
  ) {}

  async getMainStorages(req: Request): Promise<Response<Storage>> {
    const [result, count] = await this.getStoragesQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadStatesAndCells(result);
    return { result, count };
  }

  async getMyStorages(myId: number, req: Request): Promise<Response<Storage>> {
    const [result, count] = await this.getStoragesQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    await this.loadStatesAndCells(result);
    return { result, count };
  }

  async getAllStorages(req: Request): Promise<Response<Storage>> {
    const [result, count] = await this.getStoragesQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadStatesAndCells(result);
    return { result, count };
  }

  selectMainStorages(): Promise<Storage[]> {
    return this.selectStoragesQueryBuilder().getMany();
  }

  selectMyStorages(myId: number): Promise<Storage[]> {
    return this.selectStoragesQueryBuilder()
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.users', 'ownerUsers')
      .loadRelationCountAndMap('storage.cells', 'storage.cells')
      .where('ownerUsers.id = :myId', { myId })
      .getMany();
  }

  selectAllStorages(): Promise<Storage[]> {
    return this.selectStoragesQueryBuilder()
      .loadRelationCountAndMap('storage.cells', 'storage.cells')
      .getMany();
  }

  async selectFreeStorages(): Promise<Storage[]> {
    const storages = await this.selectStoragesQueryBuilder()
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
      .addSelect('storage.price')
      .getMany();
    return storages
      .filter((storage) => storage['cellsCount'] > 0)
      .map((storage) => {
        delete storage['cellsCount'];
        return storage;
      });
  }

  async createStorage(dto: ExtCreateStorageDto): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    await this.checkHasNotEnough(dto.myId);
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    await this.create(dto);
    this.mqttService.publishNotificationMessage(
      0,
      Notification.CREATED_STORAGE,
    );
  }

  async editStorage(dto: ExtEditStorageDto): Promise<void> {
    const storage = await this.checkStorageOwner(
      dto.storageId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(dto.name, dto.storageId);
    await this.checkCoordinatesNotUsed(dto.x, dto.y, dto.storageId);
    await this.edit(storage, dto);
  }

  async checkStorageExists(id: number): Promise<void> {
    await this.storagesRepository.findOneByOrFail({ id });
  }

  async checkStorageOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Storage> {
    const storage = await this.storagesRepository.findOne({
      relations: ['card', 'card.users'],
      where: { id },
    });
    if (
      !storage.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
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

  private async checkNameNotUsed(name: string, id?: number): Promise<void> {
    const storage = await this.storagesRepository.findOneBy({ name });
    if (storage && (!id || storage.id !== id)) {
      throw new AppException(StorageError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(
    x: number,
    y: number,
    id?: number,
  ): Promise<void> {
    const storage = await this.storagesRepository.findOneBy({ x, y });
    if (storage && (!id || storage.id !== id)) {
      throw new AppException(StorageError.COORDINATES_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateStorageDto): Promise<void> {
    try {
      const storage = this.storagesRepository.create({
        cardId: dto.cardId,
        name: dto.name,
        image: dto.image,
        description: dto.description,
        x: dto.x,
        y: dto.y,
        price: dto.price,
      });
      await this.storagesRepository.save(storage);
      const storageState = this.storagesStatesRepository.create({
        storageId: storage.id,
        price: storage.price,
      });
      await this.storagesStatesRepository.save(storageState);
    } catch (error) {
      throw new AppException(StorageError.CREATE_FAILED);
    }
  }

  private async edit(storage: Storage, dto: ExtEditStorageDto): Promise<void> {
    try {
      const equal = storage.price === dto.price;
      storage.name = dto.name;
      storage.image = dto.image;
      storage.description = dto.description;
      storage.x = dto.x;
      storage.y = dto.y;
      storage.price = dto.price;
      await this.storagesRepository.save(storage);
      if (!equal) {
        const storageState = this.storagesStatesRepository.create({
          storageId: storage.id,
          price: storage.price,
        });
        await this.storagesStatesRepository.save(storageState);
      }
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

  private async loadStatesAndCells(storages: Storage[]): Promise<void> {
    const promises = storages.map(async (storage) => {
      const result = await this.storagesRepository
        .createQueryBuilder('storage')
        .leftJoin('storage.states', 'state')
        .leftJoin('storage.cells', 'cell')
        .where('storage.id = :storageId', { storageId: storage.id })
        .orderBy('state.id', 'DESC')
        .addOrderBy('cell.id', 'DESC')
        .select([
          'storage.id',
          'storage.price',
          'state.id',
          'state.price',
          'state.createdAt',
          'cell.id',
          'cell.name',
        ])
        .getOne();
      storage.states = result.states;
      storage.cells = result.cells;
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
          qb.where(`${!req.id}`).orWhere('storage.id = :id', { id: req.id }),
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
      .orderBy('storage.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'storage.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerCard.name',
        'ownerCard.color',
        'storage.name',
        'storage.image',
        'storage.description',
        'storage.x',
        'storage.y',
        'storage.price',
      ]);
  }
}
