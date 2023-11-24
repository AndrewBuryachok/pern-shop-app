import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
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
    await this.shopsService.checkShopOwner(dto.shopId, dto.myId, dto.hasRole);
    await this.create(dto);
  }

  async editGood(dto: ExtEditGoodDto): Promise<void> {
    const good = await this.checkGoodOwner(dto.goodId, dto.myId, dto.hasRole);
    await this.edit(good, dto);
  }

  async deleteGood(dto: DeleteGoodDto): Promise<void> {
    const good = await this.checkGoodOwner(dto.goodId, dto.myId, dto.hasRole);
    await this.delete(good);
  }

  async checkGoodExists(id: number): Promise<void> {
    await this.goodsRepository.findOneByOrFail({ id });
  }

  async checkGoodOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Good> {
    const good = await this.goodsRepository.findOne({
      relations: ['shop'],
      where: { id },
    });
    if (good.shop.userId !== userId && !hasRole) {
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
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere('sellerUser.id = :userId', { userId: req.user }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.shop}`)
            .orWhere('shop.id = :shopId', { shopId: req.shop }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.item}`)
            .orWhere('good.item = :item', { item: req.item }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('good.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minAmount}`)
            .orWhere('good.amount >= :minAmount', { minAmount: req.minAmount }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxAmount}`)
            .orWhere('good.amount <= :maxAmount', { maxAmount: req.maxAmount }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minIntake}`)
            .orWhere('good.intake >= :minIntake', { minIntake: req.minIntake }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxIntake}`)
            .orWhere('good.intake <= :maxIntake', { maxIntake: req.maxIntake }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.kit}`).orWhere('good.kit = :kit', { kit: req.kit }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('good.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('good.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
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
        'good.amount',
        'good.intake',
        'good.kit',
        'good.price',
        'good.createdAt',
      ]);
  }
}
