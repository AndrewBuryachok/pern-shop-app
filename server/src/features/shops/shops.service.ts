import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Shop } from './shop.entity';
import { ExtCreateShopDto, ExtEditShopDto } from './shop.dto';
import { MAX_SHOPS_NUMBER } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { ShopError } from './shop-error.enum';

@Injectable()
export class ShopsService {
  constructor(
    @InjectRepository(Shop)
    private shopsRepository: Repository<Shop>,
  ) {}

  getMainShops(): Promise<Shop[]> {
    return this.getShopsQueryBuilder().getMany();
  }

  getMyShops(myId: number): Promise<Shop[]> {
    return this.getShopsQueryBuilder()
      .where('ownerUser.id = :myId', { myId })
      .getMany();
  }

  getAllShops(): Promise<Shop[]> {
    return this.getShopsQueryBuilder().getMany();
  }

  selectMyShops(myId: number): Promise<Shop[]> {
    return this.selectShopsQueryBuilder()
      .where('shop.userId = :myId', { myId })
      .getMany();
  }

  async createShop(dto: ExtCreateShopDto): Promise<void> {
    await this.checkHasNotEnough(dto.myId);
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    await this.create(dto);
  }

  async editShop(dto: ExtEditShopDto): Promise<void> {
    const shop = await this.checkShopOwner(dto.shopId, dto.myId);
    await this.edit(shop, dto);
  }

  async checkShopExists(id: number): Promise<void> {
    await this.shopsRepository.findOneByOrFail({ id });
  }

  async checkShopOwner(id: number, userId: number): Promise<Shop> {
    const shop = await this.shopsRepository.findOneBy({
      id,
      userId,
    });
    if (!shop) {
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

  private async checkNameNotUsed(name: string): Promise<void> {
    const shop = await this.shopsRepository.findOneBy({ name });
    if (shop) {
      throw new AppException(ShopError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(x: number, y: number): Promise<void> {
    const shop = await this.shopsRepository.findOneBy({ x, y });
    if (shop) {
      throw new AppException(ShopError.COORDINATES_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateShopDto): Promise<void> {
    try {
      const shop = this.shopsRepository.create({
        userId: dto.myId,
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

  private getShopsQueryBuilder(): SelectQueryBuilder<Shop> {
    return this.shopsRepository
      .createQueryBuilder('shop')
      .innerJoin('shop.user', 'ownerUser')
      .leftJoinAndMapMany(
        'shop.goods',
        'goods',
        'good',
        'shop.id = good.shopId',
      )
      .orderBy('shop.id', 'DESC')
      .addOrderBy('good.id', 'ASC')
      .select([
        'shop.id',
        'ownerUser.id',
        'ownerUser.name',
        'shop.name',
        'shop.x',
        'shop.y',
        'good.id',
        'good.item',
      ]);
  }
}
