import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from '../products/product.entity';

@Injectable()
export class LeasesService {
  constructor(
    @InjectRepository(Product)
    private leasesRepository: Repository<Product>,
  ) {}

  private getLeasesQueryBuilder(): SelectQueryBuilder<Product> {
    return this.leasesRepository
      .createQueryBuilder('lease')
      .innerJoin('lease.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'lessorCard')
      .innerJoin('lessorCard.user', 'lessorUser')
      .innerJoin('lease.card', 'renterCard')
      .innerJoin('renterCard.user', 'renterUser')
      .leftJoinAndMapMany(
        'lease.products',
        'products',
        'product',
        'lease.id = product.id',
      )
      .orderBy('lease.id', 'DESC')
      .addOrderBy('product.id', 'ASC')
      .select([
        'lease.id',
        'cell.id',
        'storage.id',
        'lessorCard.id',
        'lessorUser.id',
        'lessorUser.name',
        'lessorCard.name',
        'lessorCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'storage.price',
        'cell.name',
        'renterCard.id',
        'renterUser.id',
        'renterUser.name',
        'renterCard.name',
        'renterCard.color',
        'lease.createdAt',
        'product.id',
        'product.item',
      ]);
  }
}
