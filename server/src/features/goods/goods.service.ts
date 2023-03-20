import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Good } from './good.entity';
import { ShopsService } from '../shops/shops.service';
import { DeleteGoodDto, ExtCreateGoodDto, ExtEditGoodDto } from './good.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { getDateMonthAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { GoodError } from './good-error.enum';

@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(Good)
    private goodsRepository: Repository<Good>,
    private shopsService: ShopsService,
  ) {}

  async getGoodsStats(): Promise<Stats> {
    const current = await this.goodsRepository
      .createQueryBuilder('good')
      .where('good.createdAt >= :currentMonth', {
        currentMonth: getDateMonthAgo(1),
      })
      .getCount();
    const previous = await this.goodsRepository
      .createQueryBuilder('good')
      .where('good.createdAt >= :previousMonth', {
        previousMonth: getDateMonthAgo(2),
      })
      .getCount();
    return { current, previous: previous - current };
  }

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

  async editGood(dto: ExtEditGoodDto): Promise<void> {
    const good = await this.checkGoodOwner(dto.goodId, dto.myId);
    await this.edit(good, dto);
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
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.goodsRepository.save(good);
    } catch (error) {
      throw new AppException(GoodError.CREATE_FAILED);
    }
  }

  private async edit(good: Good, dto: ExtEditGoodDto): Promise<void> {
    try {
      good.item = dto.item;
      good.description = dto.description;
      good.amount = dto.amount;
      good.intake = dto.intake;
      good.kit = dto.kit;
      good.price = dto.price;
      await this.goodsRepository.save(good);
    } catch (error) {
      throw new AppException(GoodError.EDIT_FAILED);
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
        'sellerUser.status',
        'shop.name',
        'shop.x',
        'shop.y',
        'good.item',
        'good.description',
        'good.amount',
        'good.intake',
        'good.kit',
        'good.price',
        'good.createdAt',
      ]);
  }
}
