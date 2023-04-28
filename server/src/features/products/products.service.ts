import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './product.entity';
import { ProductState } from './product-state.entity';
import { LeasesService } from '../leases/leases.service';
import { PaymentsService } from '../payments/payments.service';
import {
  BuyProductDto,
  ExtCreateProductDto,
  ExtEditProductDto,
} from './product.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { getDateMonthAgo, getDateWeekAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { ProductError } from './product-error.enum';
import { Filter, Mode } from '../../common/enums';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductState)
    private productsStatesRepository: Repository<ProductState>,
    private leasesService: LeasesService,
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
    await this.loadStates(result);
    return { result, count };
  }

  async getMyProducts(myId: number, req: Request): Promise<Response<Product>> {
    const [result, count] = await this.getProductsQueryBuilder(req)
      .andWhere('sellerUser.id = :myId', { myId })
      .getManyAndCount();
    await this.loadStates(result);
    return { result, count };
  }

  async getPlacedProducts(
    myId: number,
    req: Request,
  ): Promise<Response<Product>> {
    const [result, count] = await this.getProductsQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    await this.loadStates(result);
    return { result, count };
  }

  async getAllProducts(req: Request): Promise<Response<Product>> {
    const [result, count] = await this.getProductsQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadStates(result);
    return { result, count };
  }

  async createProduct(dto: ExtCreateProductDto): Promise<void> {
    const leaseId = await this.leasesService.createLease(dto);
    await this.create({ ...dto, storageId: leaseId });
  }

  async editProduct(dto: ExtEditProductDto): Promise<void> {
    const product = await this.checkProductOwner(dto.productId, dto.myId);
    await this.edit(product, dto.price);
  }

  async buyProduct(dto: BuyProductDto): Promise<void> {
    const product = await this.productsRepository.findOne({
      relations: ['lease'],
      where: { id: dto.productId },
    });
    if (product.createdAt < getDateWeekAgo()) {
      throw new AppException(ProductError.ALREADY_EXPIRED);
    }
    if (product.amount < dto.amount) {
      throw new AppException(ProductError.NOT_ENOUGH_AMOUNT);
    }
    await this.paymentsService.createPayment({
      myId: dto.myId,
      senderCardId: dto.cardId,
      receiverCardId: product.lease.cardId,
      sum: dto.amount * product.price,
      description: 'buy product',
    });
    await this.buy(product, dto.amount);
  }

  async checkProductExists(id: number): Promise<void> {
    await this.productsRepository.findOneByOrFail({ id });
  }

  async checkProductOwner(id: number, userId: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({
      id,
      lease: { card: { userId } },
    });
    if (!product) {
      throw new AppException(ProductError.NOT_OWNER);
    }
    return product;
  }

  private async create(dto: ExtCreateProductDto): Promise<void> {
    try {
      const product = this.productsRepository.create({
        leaseId: dto.storageId,
        item: dto.item,
        description: dto.description,
        amount: dto.amount,
        intake: dto.intake,
        kit: dto.kit,
        price: dto.price,
      });
      await this.productsRepository.save(product);
      const productState = this.productsStatesRepository.create({
        productId: product.id,
        price: dto.price,
      });
      await this.productsStatesRepository.save(productState);
    } catch (error) {
      throw new AppException(ProductError.CREATE_FAILED);
    }
  }

  private async edit(product: Product, price: number): Promise<void> {
    try {
      product.price = price;
      await this.productsRepository.save(product);
      const productState = this.productsStatesRepository.create({
        productId: product.id,
        price,
      });
      await this.productsStatesRepository.save(productState);
    } catch (error) {
      throw new AppException(ProductError.EDIT_FAILED);
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

  private async loadStates(products: Product[]): Promise<void> {
    const promises = products.map(async (product) => {
      product['states'] = (
        await this.productsRepository
          .createQueryBuilder('product')
          .leftJoin('product.states', 'state')
          .where('product.id = :productId', { productId: product.id })
          .orderBy('state.id', 'DESC')
          .select([
            'product.id',
            'product.price',
            'state.id',
            'state.price',
            'state.createdAt',
          ])
          .getOne()
      )['states'];
    });
    await Promise.all(promises);
  }

  private getProductsQueryBuilder(req: Request): SelectQueryBuilder<Product> {
    return this.productsRepository
      .createQueryBuilder('product')
      .innerJoin('product.lease', 'lease')
      .innerJoin('lease.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('lease.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.SOME}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes(Filter.SELLER)}`)
                              .andWhere('sellerUser.id = :userId'),
                          ),
                        )
                        .orWhere(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes(Filter.OWNER)}`)
                              .andWhere('ownerUser.id = :userId'),
                          ),
                        ),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.EACH}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.SELLER)}`)
                        .orWhere('sellerUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.OWNER)}`)
                        .orWhere('ownerUser.id = :userId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `sellerUser.id ${
                      req.filters.includes(Filter.SELLER) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `ownerUser.id ${
                      req.filters.includes(Filter.OWNER) ? '=' : '!='
                    } :userId`,
                  ),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.card}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.SOME}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes(Filter.SELLER)}`)
                              .andWhere('sellerCard.id = :cardId'),
                          ),
                        )
                        .orWhere(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes(Filter.OWNER)}`)
                              .andWhere('ownerCard.id = :cardId'),
                          ),
                        ),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.EACH}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.SELLER)}`)
                        .orWhere('sellerCard.id = :cardId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.OWNER)}`)
                        .orWhere('ownerCard.id = :cardId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `sellerCard.id ${
                      req.filters.includes(Filter.SELLER) ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `ownerCard.id ${
                      req.filters.includes(Filter.OWNER) ? '=' : '!='
                    } :cardId`,
                  ),
              ),
            ),
        ),
        { cardId: req.card },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.storage}`)
            .orWhere('storage.id = :storageId', { storageId: req.storage }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.cell}`)
            .orWhere('cell.id = :cellId', { cellId: req.cell }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.item}`)
            .orWhere('product.item = :item', { item: req.item }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.description}`)
            .orWhere('product.description ILIKE :description', {
              description: req.description,
            }),
        ),
      )
      .orderBy('product.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'product.id',
        'lease.id',
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
