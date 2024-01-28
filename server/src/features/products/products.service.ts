import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from './product.entity';
import { ProductState } from './product-state.entity';
import { LeasesService } from '../leases/leases.service';
import { PaymentsService } from '../payments/payments.service';
import { MqttService } from '../mqtt/mqtt.service';
import {
  BuyProductDto,
  CompleteProductDto,
  ExtCreateProductDto,
  ExtEditProductDto,
} from './product.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateMonthBefore } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { ProductError } from './product-error.enum';
import { Kind } from '../leases/kind.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(ProductState)
    private productsStatesRepository: Repository<ProductState>,
    private leasesService: LeasesService,
    private paymentsService: PaymentsService,
    private mqttService: MqttService,
  ) {}

  getProductsStats(): Promise<number> {
    return this.productsRepository
      .createQueryBuilder('product')
      .where('product.createdAt >= :createdAt', {
        createdAt: getDateMonthBefore(),
      })
      .getCount();
  }

  async getMainProducts(req: Request): Promise<Response<Product>> {
    const [result, count] = await this.getProductsQueryBuilder(req)
      .andWhere('product.amount > 0')
      .andWhere('product.completedAt IS NULL')
      .andWhere('lease.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyProducts(myId: number, req: Request): Promise<Response<Product>> {
    const [result, count] = await this.getProductsQueryBuilder(req)
      .innerJoin('sellerCard.users', 'sellerUsers')
      .andWhere('sellerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedProducts(
    myId: number,
    req: Request,
  ): Promise<Response<Product>> {
    const [result, count] = await this.getProductsQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllProducts(req: Request): Promise<Response<Product>> {
    const [result, count] = await this.getProductsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async selectProductStates(productId: number): Promise<ProductState[]> {
    const product = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoin('product.states', 'state')
      .where('product.id = :productId', { productId })
      .orderBy('state.id', 'DESC')
      .select([
        'product.id',
        'product.price',
        'state.id',
        'state.price',
        'state.createdAt',
      ])
      .getOne();
    return product.states;
  }

  async selectProductRating(productId: number): Promise<{ rate: number }> {
    const product = await this.productsRepository
      .createQueryBuilder('product')
      .leftJoin('product.sales', 'sale')
      .where('product.id = :productId', { productId })
      .select('AVG(sale.rate)', 'rate')
      .getRawOne();
    return { rate: +product.rate };
  }

  async createProduct(dto: ExtCreateProductDto): Promise<void> {
    const leaseId = await this.leasesService.createLease({
      ...dto,
      kind: Kind.PRODUCT,
    });
    const product = await this.create({ ...dto, storageId: leaseId });
    this.mqttService.publishNotificationMessage(
      0,
      product.id,
      Notification.CREATED_PRODUCT,
    );
  }

  async editProduct(dto: ExtEditProductDto): Promise<void> {
    const product = await this.checkProductOwner(
      dto.productId,
      dto.myId,
      dto.hasRole,
    );
    await this.edit(product, dto);
  }

  async completeProduct(dto: CompleteProductDto): Promise<void> {
    const product = await this.checkProductOwner(
      dto.productId,
      dto.myId,
      dto.hasRole,
    );
    await this.complete(product);
  }

  async buyProduct(dto: BuyProductDto): Promise<Product> {
    const product = await this.productsRepository.findOne({
      relations: ['lease', 'lease.card'],
      where: { id: dto.productId },
    });
    if (product.amount < dto.amount) {
      throw new AppException(ProductError.NOT_ENOUGH_AMOUNT);
    }
    if (product.completedAt) {
      throw new AppException(ProductError.ALREADY_COMPLETED);
    }
    if (product.lease.completedAt < new Date()) {
      throw new AppException(ProductError.ALREADY_EXPIRED);
    }
    await this.paymentsService.createPayment({
      myId: dto.myId,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: product.lease.cardId,
      sum: dto.amount * product.price,
      description: '',
    });
    await this.buy(product, dto.amount);
    return product;
  }

  async checkProductExists(id: number): Promise<void> {
    await this.productsRepository.findOneByOrFail({ id });
  }

  async checkProductOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Product> {
    const product = await this.productsRepository.findOne({
      relations: ['lease', 'lease.card', 'lease.card.users'],
      where: { id },
    });
    if (
      !product.lease.card.users.map((user) => user.id).includes(userId) &&
      !hasRole
    ) {
      throw new AppException(ProductError.NOT_OWNER);
    }
    if (product.completedAt) {
      throw new AppException(ProductError.ALREADY_COMPLETED);
    }
    return product;
  }

  private async create(dto: ExtCreateProductDto): Promise<Product> {
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
      return product;
    } catch (error) {
      throw new AppException(ProductError.CREATE_FAILED);
    }
  }

  private async edit(product: Product, dto: ExtEditProductDto): Promise<void> {
    try {
      const equal = product.price === dto.price;
      product.amount = dto.amount;
      product.price = dto.price;
      await this.productsRepository.save(product);
      if (!equal) {
        const productState = this.productsStatesRepository.create({
          productId: product.id,
          price: product.price,
        });
        await this.productsStatesRepository.save(productState);
      }
    } catch (error) {
      throw new AppException(ProductError.EDIT_FAILED);
    }
  }

  private async complete(product: Product): Promise<void> {
    try {
      product.completedAt = new Date();
      await this.productsRepository.save(product);
    } catch (error) {
      throw new AppException(ProductError.COMPLETE_FAILED);
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
      .innerJoin('product.lease', 'lease')
      .innerJoin('lease.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('lease.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .loadRelationCountAndMap('product.states', 'product.states')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('product.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.SELLER}`)
                  .andWhere('sellerUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.OWNER}`)
                  .andWhere('ownerUser.id = :userId'),
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
                  .where(`${!req.mode || req.mode === Mode.SELLER}`)
                  .andWhere('sellerCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.OWNER}`)
                  .andWhere('ownerCard.id = :cardId'),
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
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minAmount}`)
            .orWhere('product.amount >= :minAmount', {
              minAmount: req.minAmount,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxAmount}`)
            .orWhere('product.amount <= :maxAmount', {
              maxAmount: req.maxAmount,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minIntake}`)
            .orWhere('product.intake >= :minIntake', {
              minIntake: req.minIntake,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxIntake}`)
            .orWhere('product.intake <= :maxIntake', {
              maxIntake: req.maxIntake,
            }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.kit}`)
            .orWhere('product.kit = :kit', { kit: req.kit }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minPrice}`)
            .orWhere('product.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('product.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('product.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('product.createdAt <= :maxDate', { maxDate: req.maxDate }),
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
        'ownerUser.nick',
        'ownerUser.avatar',
        'ownerCard.name',
        'ownerCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
        'sellerCard.id',
        'sellerUser.id',
        'sellerUser.nick',
        'sellerUser.avatar',
        'sellerCard.name',
        'sellerCard.color',
        'product.item',
        'product.description',
        'product.amount',
        'product.intake',
        'product.kit',
        'product.price',
        'product.createdAt',
        'product.completedAt',
      ]);
  }
}
