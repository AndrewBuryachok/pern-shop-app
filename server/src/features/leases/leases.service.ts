import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Lease } from './lease.entity';
import { CellsService } from '../cells/cells.service';
import { CompleteLeaseDto, ExtCreateLeaseDto } from './lease.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAgo } from '../../common/utils';
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
      .innerJoin('renterCard.users', 'renterUsers')
      .andWhere('renterUsers.id = :myId', { myId })
      .getManyAndCount();
    await this.loadThing(result);
    return { result, count };
  }

  async getPlacedLeases(myId: number, req: Request): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
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

  async completeLease(dto: CompleteLeaseDto): Promise<void> {
    const lease = await this.checkLeaseOwner(
      dto.leaseId,
      dto.myId,
      dto.hasRole,
    );
    await this.cellsService.unreserveCell(lease.cellId);
    await this.complete(lease);
  }

  async checkLeaseExists(id: number): Promise<void> {
    await this.leasesRepository.findOneByOrFail({ id });
  }

  async checkLeaseOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Lease> {
    const lease = await this.leasesRepository.findOne({
      relations: ['card', 'card.users'],
      where: { id },
    });
    if (!lease.card.users.map((user) => user.id).includes(userId) && !hasRole) {
      throw new AppException(LeaseError.NOT_OWNER);
    }
    if (lease.createdAt < getDateWeekAgo()) {
      throw new AppException(LeaseError.ALREADY_EXPIRED);
    }
    if (lease.completedAt) {
      throw new AppException(LeaseError.ALREADY_COMPLETED);
    }
    return lease;
  }

  private async create(dto: ExtCreateLeaseDto): Promise<Lease> {
    try {
      const lease = this.leasesRepository.create({
        cellId: dto.storageId,
        cardId: dto.cardId,
        kind: dto.kind,
      });
      await this.leasesRepository.save(lease);
      return lease;
    } catch (error) {
      throw new AppException(LeaseError.CREATE_FAILED);
    }
  }

  private async complete(lease: Lease): Promise<void> {
    try {
      lease.completedAt = new Date();
      await this.leasesRepository.save(lease);
    } catch (error) {
      throw new AppException(LeaseError.COMPLETE_FAILED);
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
        .leftJoinAndMapOne('lease.lot', 'lots', 'lot', 'lease.id = lot.leaseId')
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
          'lot.id',
          'lot.item',
          'lot.description',
          'order.id',
          'order.item',
          'order.description',
          'delivery.id',
          'delivery.item',
          'delivery.description',
        ])
        .getOne();
      lease['thing'] =
        result['product'] ||
        result['lot'] ||
        result['order'] ||
        result['delivery'];
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
          qb.where(`${!req.id}`).orWhere('lease.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${!req.mode || req.mode === Mode.RENTER}`)
                  .andWhere('renterUser.id = :userId'),
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
                  .where(`${!req.mode || req.mode === Mode.RENTER}`)
                  .andWhere('renterCard.id = :cardId'),
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
            .where(`${!req.kind}`)
            .orWhere('lease.kind = :kind', { kind: req.kind }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('lease.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('lease.createdAt <= :maxDate', { maxDate: req.maxDate }),
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
        'ownerUser.nick',
        'ownerCard.name',
        'ownerCard.color',
        'storage.name',
        'storage.x',
        'storage.y',
        'state.price',
        'cell.name',
        'renterCard.id',
        'renterUser.id',
        'renterUser.nick',
        'renterCard.name',
        'renterCard.color',
        'lease.kind',
        'lease.createdAt',
        'lease.completedAt',
      ]);
  }
}
