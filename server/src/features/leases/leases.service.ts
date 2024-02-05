import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Lease } from './lease.entity';
import { Thing } from '../things/thing.entity';
import { CellsService } from '../cells/cells.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateLeaseDto, ExtLeaseIdDto } from './lease.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAfter } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { LeaseError } from './lease-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class LeasesService {
  constructor(
    @InjectRepository(Lease)
    private leasesRepository: Repository<Lease>,
    private cellsService: CellsService,
    private mqttService: MqttService,
  ) {}

  async getMainLeases(req: Request): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(req)
      .andWhere('lease.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyLeases(myId: number, req: Request): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(req)
      .innerJoin('renterCard.users', 'renterUsers')
      .andWhere('renterUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedLeases(
    myId: number,
    req: Request,
  ): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllLeases(req: Request): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async selectLeaseThings(leaseId: number): Promise<Thing[]> {
    const lease = await this.leasesRepository
      .createQueryBuilder('lease')
      .leftJoin('lease.products', 'product')
      .leftJoin('lease.lots', 'lot')
      .leftJoin('lease.orders', 'order')
      .leftJoin('lease.fromDeliveries', 'fromDelivery')
      .leftJoin('lease.toDeliveries', 'toDelivery')
      .where('lease.id = :leaseId', { leaseId })
      .select([
        'lease.id',
        'product.id',
        'product.item',
        'product.description',
        'product.amount',
        'product.intake',
        'product.kit',
        'product.price',
        'lot.id',
        'lot.item',
        'lot.description',
        'lot.amount',
        'lot.intake',
        'lot.kit',
        'lot.price',
        'order.id',
        'order.item',
        'order.description',
        'order.amount',
        'order.intake',
        'order.kit',
        'order.price',
        'fromDelivery.id',
        'fromDelivery.item',
        'fromDelivery.description',
        'fromDelivery.amount',
        'fromDelivery.intake',
        'fromDelivery.kit',
        'fromDelivery.price',
        'toDelivery.id',
        'toDelivery.item',
        'toDelivery.description',
        'toDelivery.amount',
        'toDelivery.intake',
        'toDelivery.kit',
        'toDelivery.price',
      ])
      .getOne();
    return [
      ...lease.products,
      ...lease.lots,
      ...lease.orders,
      ...lease.fromDeliveries,
      ...lease.toDeliveries,
    ];
  }

  async createLease(
    dto: ExtCreateLeaseDto & { nick: string },
  ): Promise<number> {
    const cell = await this.cellsService.reserveCell(dto);
    const lease = await this.create({ ...dto, storageId: cell.id });
    this.mqttService.publishNotificationMessage(
      lease.id,
      cell.storage.card.userId,
      dto.nick,
      Notification.CREATED_LEASE,
    );
    return lease.id;
  }

  async continueLease(dto: ExtLeaseIdDto & { nick: string }): Promise<void> {
    const lease = await this.checkLeaseOwner(
      dto.leaseId,
      dto.myId,
      dto.hasRole,
    );
    const cell = await this.cellsService.continueCell({
      ...dto,
      storageId: lease.cellId,
      cardId: lease.cardId,
    });
    await this.continue(lease);
    this.mqttService.publishNotificationMessage(
      dto.leaseId,
      cell.storage.card.userId,
      dto.nick,
      Notification.CONTINUED_LEASE,
    );
  }

  async completeLease(dto: ExtLeaseIdDto & { nick: string }): Promise<void> {
    const lease = await this.checkLeaseOwner(
      dto.leaseId,
      dto.myId,
      dto.hasRole,
    );
    const cell = await this.cellsService.unreserveCell(lease.cellId);
    await this.complete(lease);
    this.mqttService.publishNotificationMessage(
      dto.leaseId,
      cell.storage.card.userId,
      dto.nick,
      Notification.COMPLETED_LEASE,
    );
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
    if (lease.completedAt < new Date()) {
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
        completedAt: getDateWeekAfter(),
      });
      await this.leasesRepository.save(lease);
      return lease;
    } catch (error) {
      throw new AppException(LeaseError.CREATE_FAILED);
    }
  }

  private async continue(lease: Lease): Promise<void> {
    try {
      lease.completedAt.setDate(lease.completedAt.getDate() + 7);
      await this.leasesRepository.save(lease);
    } catch (error) {
      throw new AppException(LeaseError.CONTINUE_FAILED);
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
        'ownerUser.avatar',
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
        'renterUser.avatar',
        'renterCard.name',
        'renterCard.color',
        'lease.kind',
        'lease.createdAt',
        'lease.completedAt',
      ]);
  }
}
