import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Shop } from './shop.entity';
import { Good } from '../goods/good.entity';
import { CardsService } from '../cards/cards.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateShopDto, ExtEditShopDto } from './shop.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { ShopError } from './shop-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
    private cardsService: CardsService,
    private mqttService: MqttService,
  ) {}

  async getMainShops(req: Request): Promise<Response<Shop>> {
    const [result, count] = await this.getShopsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyShops(myId: number, req: Request): Promise<Response<Shop>> {
    const [result, count] = await this.getShopsQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllShops(req: Request): Promise<Response<Shop>> {
    const [result, count] = await this.getShopsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectAllShops(): Promise<Shop[]> {
    return this.selectShopsQueryBuilder().getMany();
  }

  selectMyShops(myId: number): Promise<Shop[]> {
    return this.selectShopsQueryBuilder()
      .innerJoin('shop.card', 'ownerCard')
      .innerJoin('ownerCard.users', 'ownerUsers')
      .where('ownerUsers.id = :myId', { myId })
      .getMany();
  }

  async selectShopGoods(shopId: number): Promise<Good[]> {
    const shop = await this.shopsRepository
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

  async createShop(dto: ExtCreateShopDto & { nick: string }): Promise<void> {
    await this.cardsService.checkCardUser(dto.cardId, dto.myId, dto.hasRole);
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    const shop = await this.create(dto);
    this.mqttService.publishNotification(
      shop.id,
      0,
      dto.nick,
      Notification.CREATED_SHOP,
    );
  }

  async editShop(dto: ExtEditShopDto): Promise<void> {
    const shop = await this.checkShopOwner(dto.shopId, dto.myId, dto.hasRole);
    await this.checkNameNotUsed(dto.name, dto.shopId);
    await this.checkCoordinatesNotUsed(dto.x, dto.y, dto.shopId);
    await this.edit(shop, dto);
  }

  async checkShopExists(id: number): Promise<void> {
    await this.shopsRepository.findOneByOrFail({ id });
  }

  async checkShopOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Shop> {
    const shop = await this.shopsRepository.findOne({
      relations: ['card', 'card.users'],
      where: { id },
    });
    if (!shop.card.users.map((user) => user.id).includes(userId) && !hasRole) {
      throw new AppException(ShopError.NOT_OWNER);
    }
    return shop;
  }

  private async checkNameNotUsed(name: string, id?: number): Promise<void> {
    const shop = await this.shopsRepository.findOneBy({ name });
    if (shop && (!id || shop.id !== id)) {
      throw new AppException(ShopError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(
    x: number,
    y: number,
    id?: number,
  ): Promise<void> {
    const shop = await this.shopsRepository.findOneBy({ x, y });
    if (shop && (!id || shop.id !== id)) {
      throw new AppException(ShopError.COORDINATES_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateShopDto): Promise<Shop> {
    try {
      const shop = this.shopsRepository.create({
        cardId: dto.cardId,
        name: dto.name,
        description: dto.description,
        x: dto.x,
        y: dto.y,
      });
      await this.shopsRepository.save(shop);
      return shop;
    } catch (error) {
      throw new AppException(ShopError.CREATE_FAILED);
    }
  }

  private async edit(shop: Shop, dto: ExtEditShopDto): Promise<void> {
    try {
      shop.name = dto.name;
      shop.description = dto.description;
      shop.x = dto.x;
      shop.y = dto.y;
      await this.shopsRepository.save(shop);
    } catch (error) {
      throw new AppException(ShopError.EDIT_FAILED);
    }
  }

  private selectShopsQueryBuilder(): SelectQueryBuilder<Shop> {
    return this.shopsRepository
      .createQueryBuilder('shop')
      .orderBy('shop.name', 'ASC')
      .select(['shop.id', 'shop.name', 'shop.x', 'shop.y']);
  }

  private getShopsQueryBuilder(req: Request): SelectQueryBuilder<Shop> {
    return this.shopsRepository
      .createQueryBuilder('shop')
      .innerJoin('shop.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .loadRelationCountAndMap('shop.goods', 'shop.goods', 'good', (qb) =>
        qb.where('good.amount > 0'),
      )
      .where(
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
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'ownerCard.name',
        'ownerCard.color',
        'shop.name',
        'shop.description',
        'shop.x',
        'shop.y',
        'shop.createdAt',
      ]);
  }
}
