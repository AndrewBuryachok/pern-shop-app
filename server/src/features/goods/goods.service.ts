import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Good } from './good.entity';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Good)
    private goodsRepository: Repository<Good>,
  ) {}

  getMainGoods(): Promise<Good[]> {
    return this.getGoodsQueryBuilder().getMany();
  }

  getMyGoods(myId: number): Promise<Good[]> {
    return this.getGoodsQueryBuilder()
      .where('sellerUser.id = :myId', { myId })
      .getMany();
  }

  getAllGoods(): Promise<Good[]> {
    return this.getGoodsQueryBuilder().getMany();
  }

  private getGoodsQueryBuilder(): SelectQueryBuilder<Good> {
    return this.goodsRepository
      .createQueryBuilder('good')
      .innerJoin('good.shop', 'shop')
      .innerJoin('shop.user', 'sellerUser')
      .orderBy('good.id', 'DESC')
      .select([
        'good.id',
        'shop.id',
        'sellerUser.id',
        'sellerUser.name',
        'shop.name',
        'shop.x',
        'shop.y',
        'good.item',
        'good.description',
        'good.price',
        'good.createdAt',
      ]);
  }
}
