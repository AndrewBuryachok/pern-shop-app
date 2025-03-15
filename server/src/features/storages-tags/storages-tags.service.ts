import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { StorageTag } from './storage-tag.entity';
import { StorageTagState } from './storage-tag-state.entity';
import { StoragesService } from '../storages/storages.service';
import {
  ExtCreateStorageTagDto,
  ExtEditStorageTagDto,
} from './storage-tag.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { StorageTagError } from './storage-tag-error.enum';

@Injectable()
export class StoragesTagsService {
  constructor(
    @InjectRepository(StorageTag)
    private storagesTagsRepository: Repository<StorageTag>,
    @InjectRepository(StorageTagState)
    private storagesTagsStatesRepository: Repository<StorageTagState>,
    private storagesService: StoragesService,
  ) {}

  async getMainStoragesTags(req: Request): Promise<Response<StorageTag>> {
    const [result, count] = await this.getStoragesTagsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyStoragesTags(
    myId: number,
    req: Request,
  ): Promise<Response<StorageTag>> {
    const [result, count] = await this.getStoragesTagsQueryBuilder(req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllStoragesTags(req: Request): Promise<Response<StorageTag>> {
    const [result, count] = await this.getStoragesTagsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectStorageTags(storageId: number): Promise<StorageTag[]> {
    return this.selectStoragesTagsQueryBuilder()
      .where('storageTag.storageId = :storageId', { storageId })
      .getMany();
  }

  async selectStorageTagStates(
    storageTagId: number,
  ): Promise<StorageTagState[]> {
    const storageTag = await this.storagesTagsRepository
      .createQueryBuilder('storageTag')
      .leftJoin('storageTag.states', 'state')
      .where('storageTag.id = :storageTagId', { storageTagId })
      .orderBy('state.id', 'DESC')
      .select([
        'storageTag.id',
        'storageTag.price',
        'state.id',
        'state.price',
        'state.createdAt',
      ])
      .getOne();
    return storageTag.states;
  }

  async createStorageTag(dto: ExtCreateStorageTagDto): Promise<void> {
    await this.storagesService.checkStorageOwner(
      dto.storageId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(dto.storageId, dto.name);
    await this.create(dto);
  }

  async editStorageTag(dto: ExtEditStorageTagDto): Promise<void> {
    const storageTag = await this.checkStorageTagOwner(
      dto.storageTagId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(
      storageTag.storageId,
      dto.name,
      dto.storageTagId,
    );
    await this.edit(storageTag, dto);
  }

  async checkStorageTagExists(id: number): Promise<void> {
    await this.storagesTagsRepository.findOneByOrFail({ id });
  }

  async checkStorageTagOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<StorageTag> {
    const storageTag = await this.storagesTagsRepository.findOne({
      relations: [
        'storage',
        'storage.card',
        'storage.card.account',
        'storage.card.account.cards',
      ],
      where: {
        id,
        storage: { card: { account: { cards: { completedAt: IsNull() } } } },
      },
    });
    const card = storageTag.storage.card.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(StorageTagError.NOT_OWNER);
    }
    return storageTag;
  }

  private async checkNameNotUsed(
    storageId: number,
    name: string,
    id?: number,
  ): Promise<void> {
    const storageTag = await this.storagesTagsRepository.findOneBy({
      storageId,
      name,
    });
    if (storageTag && (!id || storageTag.id !== id)) {
      throw new AppException(StorageTagError.NAME_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateStorageTagDto): Promise<StorageTag> {
    try {
      const storageTag = this.storagesTagsRepository.create({
        storageId: dto.storageId,
        name: dto.name,
        price: dto.price,
      });
      await this.storagesTagsRepository.save(storageTag);
      const storageTagState = this.storagesTagsStatesRepository.create({
        storageTagId: storageTag.id,
        price: storageTag.price,
      });
      await this.storagesTagsStatesRepository.save(storageTagState);
      return storageTag;
    } catch (error) {
      throw new AppException(StorageTagError.CREATE_FAILED);
    }
  }

  private async edit(
    storageTag: StorageTag,
    dto: ExtEditStorageTagDto,
  ): Promise<void> {
    try {
      const equal = storageTag.price === dto.price;
      storageTag.name = dto.name;
      storageTag.price = dto.price;
      await this.storagesTagsRepository.save(storageTag);
      if (!equal) {
        const storageTagState = this.storagesTagsStatesRepository.create({
          storageTagId: storageTag.id,
          price: storageTag.price,
        });
        await this.storagesTagsStatesRepository.save(storageTagState);
      }
    } catch (error) {
      throw new AppException(StorageTagError.EDIT_FAILED);
    }
  }

  private selectStoragesTagsQueryBuilder(): SelectQueryBuilder<StorageTag> {
    return this.storagesTagsRepository
      .createQueryBuilder('storageTag')
      .orderBy('storageTag.name', 'ASC')
      .select(['storageTag.id', 'storageTag.name', 'storageTag.price']);
  }

  private getStoragesTagsQueryBuilder(
    req: Request,
  ): SelectQueryBuilder<StorageTag> {
    return this.storagesTagsRepository
      .createQueryBuilder('storageTag')
      .innerJoin('storageTag.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .loadRelationCountAndMap('storageTag.cells', 'storageTag.cells')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('storageTag.id = :id', { id: req.id }),
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
          qb.where(`${!req.storage}`).orWhere('storage.id = :storageId', {
            storageId: req.storage,
          }),
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
      .orderBy('storageTag.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'storageTag.id',
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
        'storageTag.name',
        'storageTag.price',
        'storageTag.createdAt',
      ]);
  }
}
