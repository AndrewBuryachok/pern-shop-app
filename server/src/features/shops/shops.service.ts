import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Shop } from './shop.entity';
import { ExtCreateShopDto, ExtEditShopDto } from './shop.dto';
import { Request, Response } from '../../common/interfaces';
import { MAX_SHOPS_NUMBER } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { ShopError } from './shop-error.enum';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
  ) {}

  async getMainShops(req: Request): Promise<Response<Shop>> {
    const [result, count] = await this.getShopsQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadGoods(result);
    return { result, count };
  }

  async getMyShops(myId: number, req: Request): Promise<Response<Shop>> {
    const [result, count] = await this.getShopsQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    await this.loadGoods(result);
    return { result, count };
  }

  async getAllShops(req: Request): Promise<Response<Shop>> {
    const [result, count] = await this.getShopsQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadGoods(result);
    return { result, count };
  }

  selectAllShops(): Promise<Shop[]> {
    return this.selectShopsQueryBuilder().getMany();
  }

  selectMyShops(myId: number): Promise<Shop[]> {
    return this.selectShopsQueryBuilder()
      .where('shop.userId = :myId', { myId })
      .getMany();
  }

  async createShop(dto: ExtCreateShopDto): Promise<void> {
    await this.checkHasNotEnough(dto.userId);
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    await this.create(dto);
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
    const shop = await this.shopsRepository.findOneBy({ id });
    if (shop.userId !== userId && !hasRole) {
      throw new AppException(ShopError.NOT_OWNER);
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
        x: dto.x,
        y: dto.y,
      });
      await this.shopsRepository.save(shop);
    } catch (error) {
      throw new AppException(ShopError.CREATE_FAILED);
    }
  }

  private async edit(shop: Shop, dto: ExtEditShopDto): Promise<void> {
    try {
      shop.name = dto.name;
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

  private async loadGoods(shops: Shop[]): Promise<void> {
    const promises = shops.map(async (shop) => {
      shop.goods = (
        await this.shopsRepository
          .createQueryBuilder('shop')
          .leftJoin('shop.goods', 'good')
          .where('shop.id = :shopId', { shopId: shop.id })
          .orderBy('good.id', 'DESC')
          .select(['shop.id', 'good.id', 'good.item', 'good.description'])
          .getOne()
      ).goods;
    });
    await Promise.all(promises);
  }

  private getShopsQueryBuilder(req: Request): SelectQueryBuilder<Shop> {
    return this.shopsRepository
      .createQueryBuilder('shop')
      .innerJoin('shop.user', 'ownerUser')
      .where(
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
        'ownerUser.name',
        'shop.name',
        'shop.x',
        'shop.y',
      ]);
  }
}
