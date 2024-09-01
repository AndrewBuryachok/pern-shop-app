import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectSchedule, Schedule } from 'nest-schedule';
import { Hire } from './hire.entity';
import { Thing } from '../things/thing.entity';
import { DrawersService } from '../drawers/drawers.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateHireDto, ExtHireIdDto } from './hire.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAfter } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { HireError } from './hire-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class HiresService implements OnModuleInit {
  constructor(
    @InjectRepository(Hire)
    private hiresRepository: Repository<Hire>,
    private drawersService: DrawersService,
    private mqttService: MqttService,
    @InjectSchedule()
    private schedule: Schedule,
  ) {}

  async onModuleInit() {
    const hires = await this.hiresRepository
      .createQueryBuilder('hire')
      .innerJoinAndSelect('hire.card', 'card')
      .where('hire.completedAt > NOW()')
      .getMany();
    hires.forEach((hire) =>
      this.addTimeout(hire.id, hire.card.userId, hire.completedAt),
    );
  }

  async getMainHires(req: Request): Promise<Response<Hire>> {
    const [result, count] = await this.getHiresQueryBuilder(req)
      .andWhere('hire.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyHires(myId: number, req: Request): Promise<Response<Hire>> {
    const [result, count] = await this.getHiresQueryBuilder(req)
      .innerJoin('tenantCard.users', 'tenantUsers')
      .andWhere('tenantUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedHires(myId: number, req: Request): Promise<Response<Hire>> {
    const [result, count] = await this.getHiresQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllHires(req: Request): Promise<Response<Hire>> {
    const [result, count] = await this.getHiresQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async selectHireThings(hireId: number): Promise<Thing[]> {
    const hire = await this.hiresRepository
      .createQueryBuilder('hire')
      .leftJoin('hire.orders', 'order')
      .leftJoin('hire.fromDeliveries', 'fromDelivery')
      .leftJoin('hire.toDeliveries', 'toDelivery')
      .leftJoin('hire.marketsDeliveries', 'marketDelivery')
      .leftJoin('marketDelivery.trade', 'trade')
      .leftJoin('trade.ware', 'ware')
      .leftJoin('hire.storagesDeliveries', 'storageDelivery')
      .leftJoin('storageDelivery.sale', 'sale')
      .leftJoin('sale.product', 'product')
      .where('hire.id = :hireId', { hireId })
      .select([
        'hire.id',
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
        'marketDelivery.id',
        'trade.id',
        'ware.id',
        'ware.item',
        'ware.description',
        'ware.intake',
        'ware.kit',
        'ware.price',
        'trade.amount',
        'storageDelivery.id',
        'sale.id',
        'product.id',
        'product.item',
        'product.description',
        'product.intake',
        'product.kit',
        'product.price',
        'sale.amount',
      ])
      .getOne();
    return [
      ...hire.orders,
      ...hire.fromDeliveries,
      ...hire.toDeliveries,
      ...hire.marketsDeliveries.map((marketDelivery) => ({
        ...marketDelivery.trade.ware,
        id: marketDelivery.id,
        amount: marketDelivery.trade.amount,
      })),
      ...hire.storagesDeliveries.map((storageDelivery) => ({
        ...storageDelivery.sale.product,
        id: storageDelivery.id,
        amount: storageDelivery.sale.amount,
      })),
    ];
  }

  async createHire(dto: ExtCreateHireDto & { nick: string }): Promise<number> {
    const drawer = await this.drawersService.reserveDrawer(dto);
    const hire = await this.create(
      { ...dto, stationId: drawer.id },
      drawer.station.price,
    );
    this.mqttService.publishNotificationMessage(
      hire.id,
      drawer.station.card.userId,
      dto.nick,
      Notification.CREATED_HIRE,
    );
    this.addTimeout(hire.id, dto.myId, hire.completedAt);
    return hire.id;
  }

  async continueHire(dto: ExtHireIdDto & { nick: string }): Promise<void> {
    const hire = await this.checkHireOwner(dto.hireId, dto.myId, dto.hasRole);
    const drawer = await this.drawersService.continueDrawer({
      ...dto,
      stationId: hire.drawerId,
      cardId: hire.cardId,
    });
    await this.continue(hire, drawer.station.price);
    this.mqttService.publishNotificationMessage(
      dto.hireId,
      drawer.station.card.userId,
      dto.nick,
      Notification.CONTINUED_HIRE,
    );
    this.removeTimeout(hire.id);
    this.addTimeout(hire.id, dto.myId, hire.completedAt);
  }

  async completeHire(dto: ExtHireIdDto & { nick: string }): Promise<void> {
    const hire = await this.checkHireOwner(dto.hireId, dto.myId, dto.hasRole);
    const drawer = await this.drawersService.unreserveDrawer(hire.drawerId);
    await this.complete(hire);
    this.mqttService.publishNotificationMessage(
      dto.hireId,
      drawer.station.card.userId,
      dto.nick,
      Notification.COMPLETED_HIRE,
    );
    this.removeTimeout(hire.id);
  }

  async checkHireExists(id: number): Promise<void> {
    await this.hiresRepository.findOneByOrFail({ id });
  }

  async checkHireOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Hire> {
    const hire = await this.hiresRepository.findOne({
      relations: ['card', 'card.users'],
      where: { id },
    });
    if (!hire.card.users.map((user) => user.id).includes(userId) && !hasRole) {
      throw new AppException(HireError.NOT_OWNER);
    }
    if (hire.completedAt < new Date()) {
      throw new AppException(HireError.ALREADY_COMPLETED);
    }
    return hire;
  }

  private addTimeout(id: number, userId: number, date: Date): void {
    const before = new Date(date);
    before.setDate(before.getDate() - 1);
    const diffA = date.getTime() - new Date().getTime();
    const diffB = before.getTime() - new Date().getTime();
    const callbackFactory = (message: string) => () => {
      this.mqttService.publishNotificationMessage(id, userId, '🔔', message);
      return true;
    };
    const callbackA = callbackFactory(Notification.ENDED_HIRE);
    const callbackB = callbackFactory(Notification.REMINDED_HIRE);
    this.schedule.scheduleTimeoutJob(`hires/${id}/a`, diffA, callbackA);
    if (diffB > 0) {
      this.schedule.scheduleTimeoutJob(`hires/${id}/b`, diffB, callbackB);
    }
  }

  private removeTimeout(id: number): void {
    this.schedule.cancelJob(`hires/${id}/a`);
    this.schedule.cancelJob(`hires/${id}/b`);
  }

  private async create(dto: ExtCreateHireDto, sum: number): Promise<Hire> {
    try {
      const hire = this.hiresRepository.create({
        drawerId: dto.stationId,
        cardId: dto.cardId,
        sum,
        completedAt: getDateWeekAfter(),
      });
      await this.hiresRepository.save(hire);
      return hire;
    } catch (error) {
      throw new AppException(HireError.CREATE_FAILED);
    }
  }

  private async continue(hire: Hire, price: number): Promise<void> {
    try {
      hire.sum += price;
      hire.completedAt.setDate(hire.completedAt.getDate() + 7);
      await this.hiresRepository.save(hire);
    } catch (error) {
      throw new AppException(HireError.CONTINUE_FAILED);
    }
  }

  private async complete(hire: Hire): Promise<void> {
    try {
      hire.completedAt = new Date();
      await this.hiresRepository.save(hire);
    } catch (error) {
      throw new AppException(HireError.COMPLETE_FAILED);
    }
  }

  private getHiresQueryBuilder(req: Request): SelectQueryBuilder<Hire> {
    return this.hiresRepository
      .createQueryBuilder('hire')
      .innerJoin('hire.drawer', 'drawer')
      .innerJoin('drawer.station', 'station')
      .innerJoin('station.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('hire.card', 'tenantCard')
      .innerJoin('tenantCard.user', 'tenantUser')
      .loadRelationCountAndMap('hire.orders', 'hire.orders')
      .loadRelationCountAndMap('hire.fromDeliveries', 'hire.fromDeliveries')
      .loadRelationCountAndMap('hire.toDeliveries', 'hire.toDeliveries')
      .loadRelationCountAndMap(
        'hire.marketsDeliveries',
        'hire.marketsDeliveries',
      )
      .loadRelationCountAndMap(
        'hire.storagesDeliveries',
        'hire.storagesDeliveries',
      )
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('hire.id = :id', { id: req.id }),
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
            .where(`${!req.station}`)
            .orWhere('station.id = :stationId', { stationId: req.station }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.drawer}`)
            .orWhere('drawer.id = :drawerId', { drawerId: req.drawer }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minSum}`)
            .orWhere('hire.sum >= :minSum', { minSum: req.minSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxSum}`)
            .orWhere('hire.sum <= :maxSum', { maxSum: req.maxSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('hire.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('hire.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('hire.completedAt < NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('hire.completedAt > NOW()'),
        ),
      )
      .orderBy('hire.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'hire.id',
        'drawer.id',
        'station.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'ownerCard.name',
        'ownerCard.color',
        'station.name',
        'station.x',
        'station.y',
        'drawer.name',
        'tenantCard.id',
        'tenantUser.id',
        'tenantUser.nick',
        'tenantUser.avatar',
        'tenantCard.name',
        'tenantCard.color',
        'hire.sum',
        'hire.createdAt',
        'hire.completedAt',
      ]);
  }
}
