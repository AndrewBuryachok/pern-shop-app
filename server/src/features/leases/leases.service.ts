import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectSchedule, Schedule } from 'nest-schedule';
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
    @InjectSchedule()
    private schedule: Schedule,
  ) {}

  async getLeasesNotifications(): Promise<number[]> {
    const leases = await this.leasesRepository
      .createQueryBuilder('lease')
      .innerJoinAndSelect('lease.card', 'card')
      .where((qb) =>
        qb
          .where('lease.completedAt > NOW()')
          .andWhere("lease.completedAt < NOW() + INTERVAL '1d'"),
      )
      .orWhere((qb) =>
        qb
          .where("lease.completedAt > NOW() + INTERVAL '3d'")
          .andWhere("lease.completedAt < NOW() + INTERVAL '4d'"),
      )
      .getMany();
    leases.forEach((lease) =>
      this.addTimeout(lease.id, lease.card.userId, lease.completedAt),
    );
    return leases.map((lease) => lease.id);
  }

  async getMainLeases(req: Request): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(req)
      .andWhere('lease.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyLeases(myId: number, req: Request): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(req)
      .innerJoin('tenantAccount.cards', 'tenantCards')
      .andWhere('tenantCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedLeases(
    myId: number,
    req: Request,
  ): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllLeases(req: Request): Promise<Response<Lease>> {
    const [result, count] = await this.getLeasesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectAllLeases(): Promise<Lease[]> {
    return this.selectLeasesQueryBuilder().getMany();
  }

  selectMyLeases(myId: number): Promise<Lease[]> {
    return this.selectLeasesQueryBuilder()
      .innerJoin('lease.card', 'tenantCard')
      .innerJoin('tenantCard.account', 'tenantAccount')
      .innerJoin('tenantAccount.cards', 'tenantCards')
      .andWhere('tenantCards.userId = :myId', { myId })
      .getMany();
  }

  async selectLeaseThings(leaseId: number): Promise<Thing[]> {
    const lease = await this.leasesRepository
      .createQueryBuilder('lease')
      .leftJoin('lease.goods', 'good', 'good.amount > 0')
      .where('lease.id = :leaseId', { leaseId })
      .orderBy('good.id', 'DESC')
      .select([
        'lease.id',
        'good.id',
        'good.item',
        'good.description',
        'good.amount',
        'good.intake',
        'good.kit',
        'good.price',
      ])
      .getOne();
    return lease.goods;
  }

  async createLease(dto: ExtCreateLeaseDto & { nick: string }): Promise<void> {
    const cell = await this.cellsService.reserveCell(dto);
    const lease = await this.create(dto, cell.storageTag.price);
    this.mqttService.publishNotification(
      lease.id,
      cell.storage.card.userId,
      dto.nick,
      Notification.CREATED_LEASE,
    );
    this.addTimeout(lease.id, dto.myId, lease.completedAt);
  }

  async continueLease(dto: ExtLeaseIdDto & { nick: string }): Promise<void> {
    const lease = await this.checkLeaseOwner(
      dto.leaseId,
      dto.myId,
      dto.hasRole,
    );
    const cell = await this.cellsService.continueCell({
      ...dto,
      cellId: lease.cellId,
      cardId: lease.cardId,
    });
    await this.continue(lease, cell.storageTag.price);
    this.mqttService.publishNotification(
      dto.leaseId,
      cell.storage.card.userId,
      dto.nick,
      Notification.CONTINUED_LEASE,
    );
    this.removeTimeout(lease.id);
    this.addTimeout(lease.id, dto.myId, lease.completedAt);
  }

  async completeLease(dto: ExtLeaseIdDto & { nick: string }): Promise<void> {
    const lease = await this.checkLeaseOwner(
      dto.leaseId,
      dto.myId,
      dto.hasRole,
    );
    const cell = await this.cellsService.unreserveCell(lease.cellId);
    await this.complete(lease);
    this.mqttService.publishNotification(
      dto.leaseId,
      cell.storage.card.userId,
      dto.nick,
      Notification.COMPLETED_LEASE,
    );
    this.removeTimeout(lease.id);
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
      relations: ['card', 'card.account', 'card.account.cards'],
      where: { id, card: { account: { cards: { completedAt: IsNull() } } } },
    });
    const card = lease.card.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(LeaseError.NOT_OWNER);
    }
    if (lease.completedAt < new Date()) {
      throw new AppException(LeaseError.ALREADY_COMPLETED);
    }
    return lease;
  }

  private addTimeout(id: number, userId: number, date: Date): void {
    const before = new Date(date);
    before.setDate(before.getDate() - 3);
    const diffA = date.getTime() - new Date().getTime();
    const diffB = before.getTime() - new Date().getTime();
    const callbackFactory = (message: string) => () => {
      this.mqttService.publishNotification(id, userId, '🔔', message);
      return true;
    };
    const callbackA = callbackFactory(Notification.ENDED_LEASE);
    const callbackB = callbackFactory(Notification.REMINDED_LEASE);
    if (diffA < 24 * 60 * 60 * 1000) {
      this.schedule.scheduleTimeoutJob(`leases/${id}/a`, diffA, callbackA);
    }
    if (diffB > 0) {
      this.schedule.scheduleTimeoutJob(`leases/${id}/b`, diffB, callbackB);
    }
  }

  private removeTimeout(id: number): void {
    this.schedule.cancelJob(`leases/${id}/a`);
    this.schedule.cancelJob(`leases/${id}/b`);
  }

  private async create(dto: ExtCreateLeaseDto, sum: number): Promise<Lease> {
    try {
      const lease = this.leasesRepository.create({
        cellId: dto.cellId,
        cardId: dto.cardId,
        sum,
        completedAt: getDateWeekAfter(),
      });
      await this.leasesRepository.save(lease);
      return lease;
    } catch (error) {
      throw new AppException(LeaseError.CREATE_FAILED);
    }
  }

  private async continue(lease: Lease, price: number): Promise<void> {
    try {
      lease.sum += price;
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

  private selectLeasesQueryBuilder(): SelectQueryBuilder<Lease> {
    return this.leasesRepository
      .createQueryBuilder('lease')
      .innerJoin('lease.cell', 'cell')
      .innerJoin('cell.storage', 'storage')
      .where('lease.completedAt > NOW()')
      .orderBy('lease.id', 'DESC')
      .select([
        'lease.id',
        'cell.id',
        'storage.id',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
      ]);
  }

  private getLeasesQueryBuilder(req: Request): SelectQueryBuilder<Lease> {
    return this.leasesRepository
      .createQueryBuilder('lease')
      .innerJoin('lease.cell', 'cell')
      .innerJoin('cell.storageTag', 'storageTag')
      .innerJoin('cell.storage', 'storage')
      .innerJoin('storage.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('lease.card', 'tenantCard')
      .innerJoin('tenantCard.account', 'tenantAccount')
      .innerJoin('tenantCard.user', 'tenantUser')
      .loadRelationCountAndMap('lease.things', 'lease.goods', 'good', (qb) =>
        qb.where('good.amount > 0'),
      )
      .where(
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
                  .where(`${!req.mode || req.mode === Mode.TENANT}`)
                  .andWhere('tenantUser.id = :userId'),
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
                  .where(`${!req.mode || req.mode === Mode.TENANT}`)
                  .andWhere('tenantCard.id = :cardId'),
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
            .where(`${!req.storageTag}`)
            .orWhere('storageTag.id = :storageTagId', {
              storageTagId: req.storageTag,
            }),
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
            .where(`${!req.minSum}`)
            .orWhere('lease.sum >= :minSum', { minSum: req.minSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxSum}`)
            .orWhere('lease.sum <= :maxSum', { maxSum: req.maxSum }),
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
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('lease.completedAt < NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('lease.completedAt > NOW()'),
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
        'ownerAccount.id',
        'ownerAccount.name',
        'ownerAccount.color',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'storage.name',
        'storage.x',
        'storage.y',
        'cell.name',
        'tenantCard.id',
        'tenantAccount.id',
        'tenantAccount.name',
        'tenantAccount.color',
        'tenantUser.id',
        'tenantUser.nick',
        'tenantUser.avatar',
        'lease.sum',
        'lease.createdAt',
        'lease.completedAt',
      ]);
  }
}
