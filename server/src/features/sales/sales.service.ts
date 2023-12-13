import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Sale } from './sale.entity';
import { ProductsService } from '../products/products.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateSaleDto, ExtRateSaleDto } from './sale.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { getDateMonthAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { SaleError } from './sale-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class SalesService {
  constructor(
    @InjectRepository(Sale)
    private salesRepository: Repository<Sale>,
    private productsService: ProductsService,
    private mqttService: MqttService,
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
      .innerJoin('buyerCard.users', 'buyerUsers')
      .andWhere('buyerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getSelledSales(myId: number, req: Request): Promise<Response<Sale>> {
    const [result, count] = await this.getSalesQueryBuilder(req)
      .innerJoin('sellerCard.users', 'sellerUsers')
      .andWhere('sellerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedSales(myId: number, req: Request): Promise<Response<Sale>> {
    const [result, count] = await this.getSalesQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
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

  async rateSale(dto: ExtRateSaleDto): Promise<void> {
    const sale = await this.checkSaleOwner(dto.saleId, dto.myId, dto.hasRole);
    await this.rate(sale, dto.rate);
    this.mqttService.publishNotificationMessage(
      sale.product.lease.card.userId,
      Notification.RATED_SALE,
    );
  }

  async checkSaleExists(id: number): Promise<void> {
    await this.salesRepository.findOneByOrFail({ id });
  }

  private async checkSaleOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Sale> {
    const sale = await this.salesRepository.findOne({
      relations: [
        'card',
        'card.users',
        'product',
        'product.lease',
        'product.lease.card',
      ],
      where: { id },
    });
    if (!sale.card.users.map((user) => user.id).includes(userId) && !hasRole) {
      throw new AppException(SaleError.NOT_OWNER);
    }
    return sale;
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

  private async rate(sale: Sale, rate: number): Promise<void> {
    try {
      sale.rate = rate || null;
      await this.salesRepository.save(sale);
    } catch (error) {
      throw new AppException(SaleError.RATE_FAILED);
    }
  }

  private getSalesQueryBuilder(req: Request): SelectQueryBuilder<Sale> {
    return this.salesRepository
      .createQueryBuilder('sale')
      .innerJoin('sale.product', 'product')
      .innerJoin('product.lease', 'lease')
      .innerJoin('lease.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('lease.card', 'sellerCard')
      .innerJoin('sellerCard.user', 'sellerUser')
      .innerJoin('sale.card', 'buyerCard')
      .innerJoin('buyerCard.user', 'buyerUser')
      .leftJoin('product.states', 'state', 'state.createdAt < sale.createdAt')
      .leftJoin(
        'product.states',
        'next',
        'state.createdAt < next.createdAt AND next.createdAt < sale.createdAt',
      )
      .where('next.id IS NULL')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.BUYER}`)
                  .andWhere('buyerUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.SELLER}`)
                  .andWhere('sellerUser.id = :userId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.OWNER}`)
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
                  .where(`${!req.mode || req.mode == Mode.BUYER}`)
                  .andWhere('buyerCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.SELLER}`)
                  .andWhere('sellerCard.id = :cardId'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.OWNER}`)
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
            .orWhere('sale.amount >= :minAmount', { minAmount: req.minAmount }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxAmount}`)
            .orWhere('sale.amount <= :maxAmount', { maxAmount: req.maxAmount }),
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
            .orWhere('state.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('state.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.rate}`)
            .orWhere('sale.rate = :rate', { rate: req.rate }),
        ),
      )
      .orderBy('sale.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'sale.id',
        'product.id',
        'lease.id',
        'cell.id',
        'storage.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.name',
        'ownerCard.name',
        'ownerCard.color',
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
        'state.price',
        'buyerCard.id',
        'buyerUser.id',
        'buyerUser.name',
        'buyerCard.name',
        'buyerCard.color',
        'sale.amount',
        'sale.createdAt',
        'sale.rate',
      ]);
  }
}
