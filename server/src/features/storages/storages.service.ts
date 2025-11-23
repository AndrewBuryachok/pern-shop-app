import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Storage } from './storage.entity';
import { CardsService } from '../cards/cards.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateStorageDto, ExtEditStorageDto } from './storage.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { StorageError } from './storage-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class StoragesService {
  constructor(
    @InjectRepository(Storage)
    private storagesRepository: Repository<Storage>,
    private cardsService: CardsService,
    private mqttService: MqttService,
  ) {}

  async getMainStorages(req: Request): Promise<Response<Storage>> {
    const [result, count] = await this.getStoragesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyStorages(myId: number, req: Request): Promise<Response<Storage>> {
    const [result, count] = await this.getStoragesQueryBuilder(req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
      .andWhere('ownerCards.completedAt IS NULL')
      .getManyAndCount();
    return { result, count };
  }

  async getAllStorages(req: Request): Promise<Response<Storage>> {
    const [result, count] = await this.getStoragesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectMainStorages(): Promise<Storage[]> {
    return this.selectStoragesQueryBuilder().getMany();
  }

  selectMyStorages(myId: number): Promise<Storage[]> {
    return this.selectStoragesQueryBuilder()
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .loadRelationCountAndMap('storage.cells', 'storage.cells')
      .where('ownerCards.userId = :myId', { myId })
      .andWhere('ownerCards.completedAt IS NULL')
      .getMany();
  }

  selectAllStorages(): Promise<Storage[]> {
    return this.selectStoragesQueryBuilder()
      .loadRelationCountAndMap('storage.cells', 'storage.cells')
      .getMany();
  }

  async createStorage(dto: ExtCreateStorageDto): Promise<void> {
    const card = await this.cardsService.checkCardUser(
      dto.cardId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    const storage = await this.create(dto);
    this.mqttService.publishNotification(
      storage.id,
      0,
      card.userId,
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
      relations: ['card', 'card.account', 'card.account.cards'],
      where: { id, card: { account: { cards: { completedAt: IsNull() } } } },
    });
    const card = storage.card.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(StorageError.NOT_OWNER);
    }
    return storage;
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

  private async create(dto: ExtCreateStorageDto): Promise<Storage> {
    try {
      const storage = this.storagesRepository.create({
        cardId: dto.cardId,
        name: dto.name,
        description: dto.description,
        x: dto.x,
        y: dto.y,
      });
      await this.storagesRepository.save(storage);
      return storage;
    } catch (error) {
      throw new AppException(StorageError.CREATE_FAILED);
    }
  }

  private async edit(storage: Storage, dto: ExtEditStorageDto): Promise<void> {
    try {
      storage.name = dto.name;
      storage.description = dto.description;
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

  private getStoragesQueryBuilder(req: Request): SelectQueryBuilder<Storage> {
    return this.storagesRepository
      .createQueryBuilder('storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .loadRelationCountAndMap('storage.tags', 'storage.tags')
      .loadRelationCountAndMap('storage.cells', 'storage.cells')
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
      .orderBy('storage.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'storage.id',
        'ownerCard.id',
        'ownerAccount.id',
        'ownerAccount.name',
        'ownerAccount.color',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'storage.name',
        'storage.description',
        'storage.x',
        'storage.y',
        'storage.createdAt',
      ]);
  }
}
