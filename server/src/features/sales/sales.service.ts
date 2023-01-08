import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Sale } from './sale.entity';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
  ) {}

  getMySales(myId: number): Promise<Sale[]> {
    return this.getSalesQueryBuilder()
      .where('buyerUser.id = :myId OR sellerUser.id = :myId', { myId })
      .getMany();
  }

  getPlacedSales(myId: number): Promise<Sale[]> {
    return this.getSalesQueryBuilder()
      .innerJoin('storage.card', 'ownerCard')
      .where('ownerCard.userId = :myId', { myId })
      .getMany();
  }

  getAllSales(): Promise<Sale[]> {
    return this.getSalesQueryBuilder().getMany();
  }

  private getSalesQueryBuilder(): SelectQueryBuilder<Sale> {
    return this.salesRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.product', 'product')
      .innerJoin('product.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('product.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .innerJoin('sale.card', 'buyerCard')
      .innerJoin('buyerCard.user', 'buyerUser')
      .orderBy('sale.id', 'DESC')
      .select([
        'sale.id',
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
        'product.intake',
        'product.kit',
        'product.price',
        'buyerCard.id',
        'buyerUser.id',
        'buyerUser.name',
        'buyerCard.name',
        'buyerCard.color',
        'sale.amount',
        'sale.createdAt',
      ]);
  }
}
