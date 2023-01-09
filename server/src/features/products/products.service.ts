import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './product.entity';
import { CellsService } from '../cells/cells.service';
import { PaymentsService } from '../payments/payments.service';
import { BuyProductDto, ExtCreateProductDto } from './product.dto';
import { getDateWeekAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { ProductError } from './product-error.enum';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    private cellsService: CellsService,
    private paymentsService: PaymentsService,
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

  async createProduct(dto: ExtCreateProductDto): Promise<void> {
    const cellId = await this.cellsService.reserveCell(dto);
    await this.create({ ...dto, storageId: cellId });
  }

  async buyProduct(dto: BuyProductDto): Promise<void> {
    const product = await this.productsRepository.findOneBy({
      id: dto.productId,
    });
    if (product.amountNow < dto.amount) {
      throw new AppException(ProductError.NOT_ENOUGH_AMOUNT);
    }
    await this.paymentsService.createPayment({
      myId: dto.myId,
      senderCardId: dto.cardId,
      receiverCardId: product.cardId,
      sum: dto.amount * product.price,
      description: 'buy product',
    });
    await this.buy(product, dto.amount);
  }

  async checkProductExists(id: number): Promise<void> {
    await this.productsRepository.findOneByOrFail({ id });
  }

  private async create(dto: ExtCreateProductDto): Promise<void> {
    try {
      const product = this.productsRepository.create({
        cellId: dto.storageId,
        cardId: dto.cardId,
        item: dto.item,
        description: dto.description,
        amountNow: dto.amount,
        amountAll: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.productsRepository.save(product);
    } catch (error) {
      throw new AppException(ProductError.CREATE_FAILED);
    }
  }

  private async buy(product: Product, amount: number): Promise<void> {
    try {
      product.amountNow -= amount;
      await this.productsRepository.save(product);
    } catch (error) {
      throw new AppException(ProductError.BUY_FAILED);
    }
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
