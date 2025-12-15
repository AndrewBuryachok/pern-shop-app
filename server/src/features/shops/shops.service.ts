import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
import { Shop } from './shop.entity';
import { Good } from '../goods/good.entity';
import { CardsService } from '../cards/cards.service';
import { MqttService } from '../mqtt/mqtt.service';
import { CompleteShopDto, ExtCreateShopDto, ExtEditShopDto } from './shop.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { ShopError } from './shop-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class ShopsService {
  private shopsRepositoryMap: Map<string, Repository<Shop>>;

  constructor(
    @InjectRepository(Shop, Database.DB1)
    private shops1Repository: Repository<Shop>,
    @InjectRepository(Shop, Database.DB2)
    private shops2Repository: Repository<Shop>,
    private cardsService: CardsService,
    private mqttService: MqttService,
  ) {
    this.shopsRepositoryMap = new Map(
      [this.shops1Repository, this.shops2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMainShops(project: string, req: Request): Promise<Response<Shop>> {
    const [result, count] = await this.getShopsQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyShops(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Shop>> {
    const [result, count] = await this.getShopsQueryBuilder(project, req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
      .andWhere('ownerCards.completedAt IS NULL')
      .getManyAndCount();
    return { result, count };
  }

  async getAllShops(project: string, req: Request): Promise<Response<Shop>> {
    const [result, count] = await this.getShopsQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectAllShops(project: string): Promise<Shop[]> {
    return this.selectShopsQueryBuilder(project).getMany();
  }

  selectMyShops(project: string, myId: number): Promise<Shop[]> {
    return this.selectShopsQueryBuilder(project)
      .innerJoin('shop.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .where('ownerCards.userId = :myId', { myId })
      .andWhere('ownerCards.completedAt IS NULL')
      .getMany();
  }

  async selectShopGoods(project: string, shopId: number): Promise<Good[]> {
    const shop = await this.shopsRepositoryMap
      .get(project)
      .createQueryBuilder('shop')
      .leftJoin('shop.goods', 'good', 'good.amount > 0')
      .where('shop.id = :shopId', { shopId })
      .orderBy('good.id', 'DESC')
      .select([
        'shop.id',
        'good.id',
        'good.item',
        'good.description',
        'good.amount',
        'good.intake',
        'good.kit',
        'good.price',
      ])
      .getOne();
    return shop.goods;
  }

  async createShop(project: string, dto: ExtCreateShopDto): Promise<void> {
    const card = await this.cardsService.checkCardUser(
      project,
      dto.cardId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(project, dto.name);
    await this.checkCoordinatesNotUsed(project, dto.x, dto.y);
    const shop = await this.create(project, dto);
    this.mqttService.publishNotification(
      project,
      shop.id,
      0,
      card.userId,
      Notification.CREATED_SHOP,
    );
  }

  async editShop(project: string, dto: ExtEditShopDto): Promise<void> {
    const shop = await this.checkShopOwner(
      project,
      dto.shopId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(project, dto.name, dto.shopId);
    await this.checkCoordinatesNotUsed(project, dto.x, dto.y, dto.shopId);
    await this.edit(project, shop, dto);
  }

  async completeShop(project: string, dto: CompleteShopDto): Promise<void> {
    const shop = await this.checkShopOwner(
      project,
      dto.shopId,
      dto.myId,
      dto.hasRole,
    );
    await this.complete(project, shop);
  }

  async checkShopExists(project: string, id: number): Promise<void> {
    await this.shopsRepositoryMap.get(project).findOneByOrFail({ id });
  }

  async checkShopOwner(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Shop> {
    const shop = await this.shopsRepositoryMap.get(project).findOne({
      relations: ['card', 'card.account', 'card.account.cards'],
      where: { id, card: { account: { cards: { completedAt: IsNull() } } } },
    });
    const card = shop.card.account.cards.find((card) => card.userId === userId);
    if (!card && !hasRole) {
      throw new AppException(ShopError.NOT_OWNER);
    }
    if (shop.completedAt) {
      throw new AppException(ShopError.ALREADY_COMPLETED);
    }
    return shop;
  }

  private async checkNameNotUsed(
    project: string,
    name: string,
    id?: number,
  ): Promise<void> {
    const shop = await this.shopsRepositoryMap.get(project).findOneBy({
      name,
      completedAt: IsNull(),
    });
    if (shop && (!id || shop.id !== id)) {
      throw new AppException(ShopError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(
    project: string,
    x: number,
    y: number,
    id?: number,
  ): Promise<void> {
    const shop = await this.shopsRepositoryMap.get(project).findOneBy({
      x,
      y,
      completedAt: IsNull(),
    });
    if (shop && (!id || shop.id !== id)) {
      throw new AppException(ShopError.COORDINATES_ALREADY_USED);
    }
  }

  private async create(project: string, dto: ExtCreateShopDto): Promise<Shop> {
    try {
      const shop = this.shopsRepositoryMap.get(project).create({
        cardId: dto.cardId,
        name: dto.name,
        description: dto.description,
        x: dto.x,
        y: dto.y,
      });
      await this.shopsRepositoryMap.get(project).save(shop);
      return shop;
    } catch (error) {
      throw new AppException(ShopError.CREATE_FAILED);
    }
  }

  private async edit(
    project: string,
    shop: Shop,
    dto: ExtEditShopDto,
  ): Promise<void> {
    try {
      shop.name = dto.name;
      shop.description = dto.description;
      shop.x = dto.x;
      shop.y = dto.y;
      await this.shopsRepositoryMap.get(project).save(shop);
    } catch (error) {
      throw new AppException(ShopError.EDIT_FAILED);
    }
  }

  private async complete(project: string, shop: Shop): Promise<void> {
    try {
      shop.completedAt = new Date();
      await this.shopsRepositoryMap.get(project).save(shop);
    } catch (error) {
      throw new AppException(ShopError.COMPLETE_FAILED);
    }
  }

  private selectShopsQueryBuilder(project: string): SelectQueryBuilder<Shop> {
    return this.shopsRepositoryMap
      .get(project)
      .createQueryBuilder('shop')
      .where('shop.completedAt IS NULL')
      .orderBy('shop.name', 'ASC')
      .select(['shop.id', 'shop.name', 'shop.x', 'shop.y']);
  }

  private getShopsQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Shop> {
    return this.shopsRepositoryMap
      .get(project)
      .createQueryBuilder('shop')
      .innerJoin('shop.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .loadRelationCountAndMap('shop.goods', 'shop.goods', 'good', (qb) =>
        qb.where('good.amount > 0'),
      )
      .where('shop.completedAt IS NULL')
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('shop.id = :id', { id: req.id }),
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
            .where(`${!req.shop}`)
            .orWhere('shop.id = :shopId', { shopId: req.shop }),
        ),
      )
      .orderBy('shop.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'shop.id',
        'ownerCard.id',
        'ownerAccount.id',
        'ownerAccount.name',
        'ownerAccount.color',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'shop.name',
        'shop.description',
        'shop.x',
        'shop.y',
        'shop.createdAt',
      ]);
  }
}
