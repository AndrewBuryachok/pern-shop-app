import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './product.entity';
import { getDateWeekAgo } from '../../common/utils';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  getMainProducts(): Promise<Product[]> {
    return this.getProductsQueryBuilder()
      .where('product.amountNow > 0 AND product.createdAt > :createdAt', {
        createdAt: getDateWeekAgo(),
      })
      .getMany();
  }

  getMyProducts(myId: number): Promise<Product[]> {
    return this.getProductsQueryBuilder()
      .where('sellerUser.id = :myId', { myId })
      .getMany();
  }

  getPlacedProducts(myId: number): Promise<Product[]> {
    return this.getProductsQueryBuilder()
      .innerJoin('storage.card', 'ownerCard')
      .where('ownerCard.userId = :myId', { myId })
      .getMany();
  }

  getAllProducts(): Promise<Product[]> {
    return this.getProductsQueryBuilder().getMany();
  }

  async checkProductExists(id: number): Promise<void> {
    await this.productsRepository.findOneByOrFail({ id });
  }

  private getProductsQueryBuilder(): SelectQueryBuilder<Product> {
    return this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('product.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .orderBy('product.id', 'DESC')
      .select([
        'product.id',
        'cell.id',
        'storage.id',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
        'sellerCard.id',
        'sellerUser.id',
        'sellerUser.name',
        'sellerCard.name',
        'sellerCard.color',
        'product.item',
        'product.description',
        'product.amountNow',
        'product.amountAll',
        'product.intake',
        'product.kit',
        'product.price',
        'product.createdAt',
      ]);
  }
}
