import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Sale } from './sale.entity';
import { ProductsService } from '../products/products.service';
import { ExtCreateSaleDto } from './sale.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { getDateMonthAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { SaleError } from './sale-error.enum';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    private productsService: ProductsService,
  ) {}

  async getSalesStats(): Promise<Stats> {
    const current = await this.salesRepository
      .createQueryBuilder('sale')
      .where('sale.createdAt >= :currentMonth', {
        currentMonth: getDateMonthAgo(1),
      })
      .getCount();
    const previous = await this.salesRepository
      .createQueryBuilder('sale')
      .where('sale.createdAt >= :previousMonth', {
        previousMonth: getDateMonthAgo(2),
      })
      .getCount();
    return { current, previous: previous - current };
  }

  async getMySales(myId: number, req: Request): Promise<Response<Sale>> {
    const [result, count] = await this.getSalesQueryBuilder(req)
      .andWhere(
        '(ownerUser.id = :myId OR buyerUser.id = :myId OR sellerUser.id = :myId)',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllSales(req: Request): Promise<Response<Sale>> {
    const [result, count] = await this.getSalesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createSale(dto: ExtCreateSaleDto): Promise<void> {
    await this.productsService.buyProduct(dto);
    await this.create(dto);
  }

  private async create(dto: ExtCreateSaleDto): Promise<void> {
    try {
      const sale = this.salesRepository.create({
        productId: dto.productId,
        cardId: dto.cardId,
        amount: dto.amount,
      });
      await this.salesRepository.save(sale);
    } catch (error) {
      throw new AppException(SaleError.CREATE_FAILED);
    }
  }

  private getSalesQueryBuilder(req: Request): SelectQueryBuilder<Sale> {
    return this.salesRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.product', 'product')
      .innerJoin('product.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('product.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .innerJoin('sale.card', 'buyerCard')
      .innerJoin('buyerCard.user', 'buyerUser')
      .where(
        '(ownerUser.name ILIKE :search OR buyerUser.name ILIKE :search OR sellerUser.name ILIKE :search)',
        { search: `%${req.search || ''}%` },
      )
      .orderBy('sale.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
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
        'sellerUser.status',
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
        'buyerUser.status',
        'buyerCard.name',
        'buyerCard.color',
        'sale.amount',
        'sale.createdAt',
      ]);
  }
}
