import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Lease } from './lease.entity';
import { CellsService } from '../cells/cells.service';
import { ExtCreateLeaseDto } from './lease.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { LeaseError } from './lease-error.enum';
import { Mode } from '../../common/enums';

@Injectable()
export class LeasesService {
  constructor(
    @InjectRepository(Lease)
    private leasesRepository: Repository<Lease>,
    private cellsService: CellsService,
  ) {}

  async getMyLeases(myId: number, req: Request): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .innerJoin('renterCard.users', 'renterUsers')
      .andWhere(
        new Brackets((qb) =>
          qb.where('renterUsers.id = :myId').orWhere('ownerUsers.id = :myId'),
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
      .leftJoin('storage.states', 'state', 'state.createdAt < lease.createdAt')
      .leftJoin(
        'storage.states',
        'next',
        'state.createdAt < next.createdAt AND next.createdAt < lease.createdAt',
      )
      .where('next.id IS NULL')
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode == Mode.RENTER}`)
                  .andWhere('renterUser.id = :userId'),
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
                  .where(`${!req.mode || req.mode == Mode.RENTER}`)
                  .andWhere('renterCard.id = :cardId'),
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
        'state.price',
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
