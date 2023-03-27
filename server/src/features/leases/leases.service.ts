import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from '../products/product.entity';
import { Request, Response } from '../../common/interfaces';

@Injectable()
export class LeasesService {
  constructor(
    @InjectRepository(Product)
    private leasesRepository: Repository<Product>,
  ) {}

  async getMyLeases(myId: number, req: Request): Promise<Response<Product>> {
    const [result, count] = await this.getLeasesQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb.where('renterUser.id = :myId').orWhere('ownerUser.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    await this.loadProducts(result);
    return { result, count };
  }

  async getAllLeases(req: Request): Promise<Response<Product>> {
    const [result, count] = await this.getLeasesQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadProducts(result);
    return { result, count };
  }

  private async loadProducts(leases: Product[]): Promise<void> {
    const promises = leases.map(async (lease) => {
      lease['products'] = (
        await this.leasesRepository
          .createQueryBuilder('lease')
          .leftJoinAndMapMany(
            'lease.products',
            'products',
            'product',
            'lease.id = product.id',
          )
          .where('lease.id = :leaseId', { leaseId: lease.id })
          .orderBy('product.id', 'ASC')
          .select([
            'lease.id',
            'product.id',
            'product.item',
            'product.description',
          ])
          .getOne()
      )['products'];
    });
    await Promise.all(promises);
  }

  private getLeasesQueryBuilder(req: Request): SelectQueryBuilder<Product> {
    return this.leasesRepository
      .createQueryBuilder('lease')
      .innerJoin('lease.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('lease.card', 'renterCard')
      .innerJoin('renterCard.user', 'renterUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode}`)
                  .andWhere(
                    `renterUser.id ${
                      req.filters.includes('renter') ? '=' : '!='
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
                              .where(`${req.filters.includes('renter')}`)
                              .andWhere('renterUser.id = :userId'),
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
            .where(`${!req.card}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode}`)
                  .andWhere(
                    `renterCard.id ${
                      req.filters.includes('renter') ? '=' : '!='
                    } :cardId`,
                  )
                  .andWhere(
                    `ownerCard.id ${
                      req.filters.includes('owner') ? '=' : '!='
                    } :cardId`,
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
                              .where(`${req.filters.includes('renter')}`)
                              .andWhere('renterCard.id = :cardId'),
                          ),
                        )
                        .orWhere(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes('owner')}`)
                              .andWhere('ownerCard.id = :cardId'),
                          ),
                        ),
                    ),
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
      .orderBy('lease.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
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
        'storage.price',
        'cell.name',
        'renterCard.id',
        'renterUser.id',
        'renterUser.name',
        'renterUser.status',
        'renterCard.name',
        'renterCard.color',
        'lease.createdAt',
      ]);
  }
}
