import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Sale } from './sale.entity';
import { ProductsService } from '../products/products.service';
import { ExtCreateSaleDto } from './sale.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { getDateMonthAgo } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { SaleError } from './sale-error.enum';
import { Filter, Mode } from '../../common/enums';

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
        new Brackets((qb) =>
          qb.where('buyerUser.id = :myId').orWhere('sellerUser.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getPlacedSales(myId: number, req: Request): Promise<Response<Sale>> {
    const [result, count] = await this.getSalesQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
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
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb.where(`${req.mode === Mode.SOME}`).andWhere(
                  new Brackets((qb) =>
                    qb
                      .where(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.BUYER)}`)
                            .andWhere('buyerUser.id = :userId'),
                        ),
                      )
                      .orWhere(
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
                        .where(`${!req.filters.includes(Filter.BUYER)}`)
                        .orWhere('buyerUser.id = :userId'),
                    ),
                  )
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
                    `buyerUser.id ${
                      req.filters.includes(Filter.BUYER) ? '=' : '!='
                    } :userId`,
                  )
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
                qb.where(`${req.mode === Mode.SOME}`).andWhere(
                  new Brackets((qb) =>
                    qb
                      .where(
                        new Brackets((qb) =>
                          qb
                            .where(`${req.filters.includes(Filter.BUYER)}`)
                            .andWhere('buyerCard.id = :cardId'),
                        ),
                      )
                      .orWhere(
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
                        .where(`${!req.filters.includes(Filter.BUYER)}`)
                        .orWhere('buyerCard.id = :cardId'),
                    ),
                  )
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
                    `buyerCard.id ${
                      req.filters.includes(Filter.BUYER) ? '=' : '!='
                    } :cardId`,
                  )
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
      .orderBy('sale.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'sale.id',
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
