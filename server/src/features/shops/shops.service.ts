import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Shop } from './shop.entity';

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
