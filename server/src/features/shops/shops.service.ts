import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Shop } from './shop.entity';
import { User } from '../users/user.entity';
import { Good } from '../goods/good.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateShopDto,
  ExtEditShopDto,
  ExtUpdateShopUserDto,
} from './shop.dto';
import { Request, Response } from '../../common/interfaces';
import { MAX_SHOPS_NUMBER } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { ShopError } from './shop-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
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
      .innerJoin('shop.users', 'ownerUsers')
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
      .innerJoin('shop.users', 'ownerUsers')
      .where('ownerUsers.id = :myId', { myId })
      .getMany();
  }

  async selectShopUsers(shopId: number): Promise<User[]> {
    const shop = await this.shopsRepository
      .createQueryBuilder('shop')
      .leftJoin('shop.users', 'user')
      .where('shop.id = :shopId', { shopId })
      .orderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.nick', 'ASC')
      .select(['shop.id', 'user.id', 'user.nick', 'user.avatar'])
      .getOne();
    return shop.users;
  }

  async selectShopGoods(shopId: number): Promise<Good[]> {
    const shop = await this.shopsRepository
      .createQueryBuilder('shop')
      .leftJoin('shop.goods', 'good')
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

  async createShop(dto: ExtCreateShopDto): Promise<void> {
    await this.checkHasNotEnough(dto.userId);
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    await this.create(dto);
    this.mqttService.publishNotificationMessage(0, Notification.CREATED_SHOP);
  }

  async editShop(dto: ExtEditShopDto): Promise<void> {
    const shop = await this.checkShopOwner(dto.shopId, dto.myId, dto.hasRole);
    await this.checkNameNotUsed(dto.name, dto.shopId);
    await this.checkCoordinatesNotUsed(dto.x, dto.y, dto.shopId);
    await this.edit(shop, dto);
  }

  async addShopUser(dto: ExtUpdateShopUserDto): Promise<void> {
    const shop = await this.checkShopOwner(dto.shopId, dto.myId, dto.hasRole);
    if (shop.users.map((user) => user.id).includes(dto.userId)) {
      throw new AppException(ShopError.ALREADY_IN_SHOP);
    }
    await this.addUser(shop, dto.userId);
    this.mqttService.publishNotificationMessage(
      dto.userId,
      Notification.ADDED_SHOP,
    );
  }

  async removeShopUser(dto: ExtUpdateShopUserDto): Promise<void> {
    const shop = await this.checkShopOwner(dto.shopId, dto.myId, dto.hasRole);
    if (dto.userId === dto.myId) {
      throw new AppException(ShopError.OWNER);
    }
    if (!shop.users.map((user) => user.id).includes(dto.userId)) {
      throw new AppException(ShopError.NOT_IN_SHOP);
    }
    await this.removeUser(shop, dto.userId);
    this.mqttService.publishNotificationMessage(
      dto.userId,
      Notification.REMOVED_SHOP,
    );
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
      relations: ['users'],
      where: { id },
    });
    if (shop.userId !== userId && !hasRole) {
      throw new AppException(ShopError.NOT_OWNER);
    }
    return shop;
  }

  async checkShopUser(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Shop> {
    const shop = await this.shopsRepository.findOne({
      relations: ['users'],
      where: { id },
    });
    if (!shop.users.map((user) => user.id).includes(userId) && !hasRole) {
      throw new AppException(ShopError.NOT_USER);
    }
    return shop;
  }

  private async checkHasNotEnough(userId: number): Promise<void> {
    const count = await this.shopsRepository.countBy({ userId });
    if (count === MAX_SHOPS_NUMBER) {
      throw new AppException(ShopError.ALREADY_HAS_ENOUGH);
    }
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

  private async create(dto: ExtCreateShopDto): Promise<void> {
    try {
      const shop = this.shopsRepository.create({
        userId: dto.userId,
        name: dto.name,
        image: dto.image,
        video: dto.video,
        description: dto.description,
        x: dto.x,
        y: dto.y,
        users: [{ id: dto.userId }],
      });
      await this.shopsRepository.save(shop);
    } catch (error) {
      throw new AppException(ShopError.CREATE_FAILED);
    }
  }

  private async edit(shop: Shop, dto: ExtEditShopDto): Promise<void> {
    try {
      shop.name = dto.name;
      shop.image = dto.image;
      shop.video = dto.video;
      shop.description = dto.description;
      shop.x = dto.x;
      shop.y = dto.y;
      await this.shopsRepository.save(shop);
    } catch (error) {
      throw new AppException(ShopError.EDIT_FAILED);
    }
  }

  private async addUser(shop: Shop, userId: number): Promise<void> {
    try {
      const user = new User();
      user.id = userId;
      shop.users.push(user);
      await this.shopsRepository.save(shop);
    } catch (error) {
      throw new AppException(ShopError.ADD_USER_FAILED);
    }
  }

  private async removeUser(shop: Shop, userId: number): Promise<void> {
    try {
      shop.users = shop.users.filter((user) => user.id !== userId);
      await this.shopsRepository.save(shop);
    } catch (error) {
      throw new AppException(ShopError.REMOVE_USER_FAILED);
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
      .innerJoin('shop.user', 'ownerUser')
      .loadRelationCountAndMap('shop.users', 'shop.users')
      .loadRelationCountAndMap('shop.goods', 'shop.goods')
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
            .where(`${!req.shop}`)
            .orWhere('shop.id = :shopId', { shopId: req.shop }),
        ),
      )
      .orderBy('shop.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'shop.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'shop.name',
        'shop.image',
        'shop.video',
        'shop.description',
        'shop.x',
        'shop.y',
      ]);
  }
}
