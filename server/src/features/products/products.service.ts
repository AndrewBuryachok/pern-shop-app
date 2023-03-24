import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './product.entity';
import { CellsService } from '../cells/cells.service';
import { PaymentsService } from '../payments/payments.service';
import { BuyProductDto, ExtCreateProductDto } from './product.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { getDateMonthAgo, getDateWeekAgo } from '../../common/utils';
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

  async getProductsStats(): Promise<Stats> {
    const current = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.createdAt >= :currentMonth', {
        currentMonth: getDateMonthAgo(1),
      })
      .getCount();
    const previous = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.createdAt >= :previousMonth', {
        previousMonth: getDateMonthAgo(2),
      })
      .getCount();
    return { current, previous: previous - current };
  }

  async getMainProducts(req: Request): Promise<Response<Product>> {
    const [result, count] = await this.getProductsQueryBuilder(req)
      .andWhere('product.amount > 0')
      .andWhere('product.createdAt > :date', { date: getDateWeekAgo() })
      .getManyAndCount();
    return { result, count };
  }

  async getMyProducts(myId: number, req: Request): Promise<Response<Product>> {
    const [result, count] = await this.getProductsQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb.where('sellerUser.id = :myId').orWhere('ownerUser.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllProducts(req: Request): Promise<Response<Product>> {
    const [result, count] = await this.getProductsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createProduct(dto: ExtCreateProductDto): Promise<void> {
    const cellId = await this.cellsService.reserveCell(dto);
    await this.create({ ...dto, storageId: cellId });
  }

  async buyProduct(dto: BuyProductDto): Promise<void> {
    const product = await this.productsRepository.findOneBy({
      id: dto.productId,
    });
    if (product.amount < dto.amount) {
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
        amount: dto.amount,
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
      product.amount -= amount;
      await this.productsRepository.save(product);
    } catch (error) {
      throw new AppException(ProductError.BUY_FAILED);
    }
  }

  private getProductsQueryBuilder(req: Request): SelectQueryBuilder<Product> {
    return this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('product.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode}`)
                  .andWhere(
                    `sellerUser.id ${
                      req.filters.includes('seller') ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `ownerUser.id ${
                      req.filters.includes('owner') ? '=' : '!='
                    } :userId`,
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes('seller')}`)
                              .andWhere('sellerUser.id = :userId'),
                          ),
                        )
                        .orWhere(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes('owner')}`)
                              .andWhere('ownerUser.id = :userId'),
                          ),
                        ),
                    ),
                  ),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.item}`)
            .orWhere('product.item = :item', { item: req.item }),
        ),
      )
      .andWhere('product.description ILIKE :description', {
        description: `%${req.description}%`,
      })
      .orderBy('product.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'product.id',
        'cell.id',
        'storage.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.name',
        'ownerUser.status',
        'ownerCard.name',
        'ownerCard.color',
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
        'product.amount',
        'product.intake',
        'product.kit',
        'product.price',
        'product.createdAt',
      ]);
  }
}
