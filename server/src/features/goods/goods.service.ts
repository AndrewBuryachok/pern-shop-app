import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Good } from './good.entity';
import { ShopsService } from '../shops/shops.service';
import { DeleteGoodDto, ExtCreateGoodDto } from './good.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { GoodError } from './good-error.enum';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Good)
    private goodsRepository: Repository<Good>,
    private shopsService: ShopsService,
  ) {}

  async getMainGoods(req: Request): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyGoods(myId: number, req: Request): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(req)
      .andWhere('sellerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllGoods(req: Request): Promise<Response<Good>> {
    const [result, count] = await this.getGoodsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createGood(dto: ExtCreateGoodDto): Promise<void> {
    await this.shopsService.checkShopOwner(dto.shopId, dto.myId);
    await this.create(dto);
  }

  async deleteGood(dto: DeleteGoodDto): Promise<void> {
    const good = await this.checkGoodOwner(dto.goodId, dto.myId);
    await this.delete(good);
  }

  async checkGoodExists(id: number): Promise<void> {
    await this.goodsRepository.findOneByOrFail({ id });
  }

  async checkGoodOwner(id: number, userId: number): Promise<Good> {
    const good = await this.goodsRepository.findOneBy({
      id,
      shop: { userId },
    });
    if (!good) {
      throw new AppException(GoodError.NOT_OWNER);
    }
    return good;
  }

  private async create(dto: ExtCreateGoodDto): Promise<void> {
    try {
      const good = this.goodsRepository.create({
        shopId: dto.shopId,
        item: dto.item,
        description: dto.description,
        price: dto.price,
      });
      await this.goodsRepository.save(good);
    } catch (error) {
      throw new AppException(GoodError.CREATE_FAILED);
    }
  }

  private async delete(good: Good): Promise<void> {
    try {
      await this.goodsRepository.remove(good);
    } catch (error) {
      throw new AppException(GoodError.DELETE_FAILED);
    }
  }

  private getGoodsQueryBuilder(req: Request): SelectQueryBuilder<Good> {
    return this.goodsRepository
      .createQueryBuilder('good')
      .innerJoin('good.shop', 'shop')
      .innerJoin('shop.user', 'sellerUser')
      .where('sellerUser.name ILIKE :search', {
        search: `%${req.search || ''}%`,
      })
      .orderBy('good.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
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
