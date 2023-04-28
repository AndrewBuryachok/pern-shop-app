import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Lease } from './lease.entity';
import { CellsService } from '../cells/cells.service';
import { ExtCreateLeaseDto } from './lease.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { LeaseError } from './lease-error.enum';
import { Filter, Mode } from '../../common/enums';

@Injectable()
export class LeasesService {
  constructor(
    @InjectRepository(Lease)
    private leasesRepository: Repository<Lease>,
    private cellsService: CellsService,
  ) {}

  async getMyLeases(myId: number, req: Request): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb.where('renterUser.id = :myId').orWhere('ownerUser.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    await this.loadThing(result);
    return { result, count };
  }

  async getAllLeases(req: Request): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadThing(result);
    return { result, count };
  }

  async createLease(dto: ExtCreateLeaseDto): Promise<number> {
    const cellId = await this.cellsService.reserveCell(dto);
    const lease = await this.create({ ...dto, storageId: cellId });
    return lease.id;
  }

  private async create(dto: ExtCreateLeaseDto): Promise<Lease> {
    try {
      const lease = this.leasesRepository.create({
        cellId: dto.storageId,
        cardId: dto.cardId,
      });
      await this.leasesRepository.save(lease);
      return lease;
    } catch (error) {
      throw new AppException(LeaseError.CREATE_FAILED);
    }
  }

  private async loadThing(leases: Lease[]): Promise<void> {
    const promises = leases.map(async (lease) => {
      const result = await this.leasesRepository
        .createQueryBuilder('lease')
        .leftJoinAndMapOne(
          'lease.product',
          'products',
          'product',
          'lease.id = product.leaseId',
        )
        .leftJoinAndMapOne(
          'lease.order',
          'orders',
          'order',
          'lease.id = order.leaseId',
        )
        .leftJoinAndMapOne(
          'lease.delivery',
          'deliveries',
          'delivery',
          'lease.id = delivery.fromLeaseId OR lease.id = delivery.toLeaseId',
        )
        .where('lease.id = :leaseId', { leaseId: lease.id })
        .select([
          'lease.id',
          'product.id',
          'product.item',
          'product.description',
          'order.id',
          'order.item',
          'order.description',
          'delivery.id',
          'delivery.item',
          'delivery.description',
        ])
        .getOne();
      lease['type'] = result['delivery']
        ? 'delivery'
        : result['order']
        ? 'order'
        : 'product';
      lease['thing'] =
        result['product'] || result['order'] || result['delivery'];
    });
    await Promise.all(promises);
  }

  private getLeasesQueryBuilder(req: Request): SelectQueryBuilder<Lease> {
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
                  .where(`${req.mode === Mode.SOME}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes(Filter.RENTER)}`)
                              .andWhere('renterUser.id = :userId'),
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
                        .where(`${!req.filters.includes(Filter.RENTER)}`)
                        .orWhere('renterUser.id = :userId'),
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
                    `renterUser.id ${
                      req.filters.includes(Filter.RENTER) ? '=' : '!='
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
                              .where(`${req.filters.includes(Filter.RENTER)}`)
                              .andWhere('renterCard.id = :cardId'),
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
                        .where(`${!req.filters.includes(Filter.RENTER)}`)
                        .orWhere('renterCard.id = :cardId'),
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
                    `renterCard.id ${
                      req.filters.includes(Filter.RENTER) ? '=' : '!='
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
