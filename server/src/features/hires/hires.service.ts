import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectSchedule, Schedule } from 'nest-schedule';
import { Hire } from './hire.entity';
import { Thing } from '../things/thing.entity';
import { BoxesService } from '../boxes/boxes.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateHireDto, ExtHireIdDto } from './hire.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAfter } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { HireError } from './hire-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class HiresService {
  constructor(
    @InjectRepository(Hire)
    private hiresRepository: Repository<Hire>,
    private boxesService: BoxesService,
    private mqttService: MqttService,
    @InjectSchedule()
    private schedule: Schedule,
  ) {}

  async getHiresNotifications(): Promise<number[]> {
    const hires = await this.hiresRepository
      .createQueryBuilder('hire')
      .innerJoinAndSelect('hire.card', 'card')
      .where((qb) =>
        qb
          .where('hire.completedAt > NOW()')
          .andWhere("hire.completedAt < NOW() + INTERVAL '1d'"),
      )
      .orWhere((qb) =>
        qb
          .where("hire.completedAt > NOW() + INTERVAL '3d'")
          .andWhere("hire.completedAt < NOW() + INTERVAL '4d'"),
      )
      .getMany();
    hires.forEach((hire) =>
      this.addTimeout(hire.id, hire.card.userId, hire.completedAt),
    );
    return hires.map((hire) => hire.id);
  }

  async getMainHires(req: Request): Promise<Response<Hire>> {
    const [result, count] = await this.getHiresQueryBuilder(req)
      .andWhere('hire.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyHires(myId: number, req: Request): Promise<Response<Hire>> {
    const [result, count] = await this.getHiresQueryBuilder(req)
      .innerJoin('tenantAccount.cards', 'tenantCards')
      .andWhere('tenantCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedHires(myId: number, req: Request): Promise<Response<Hire>> {
    const [result, count] = await this.getHiresQueryBuilder(req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
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
      .leftJoin('hire.deliveries', 'delivery')
      .leftJoin('delivery.purchase', 'purchase')
      .leftJoin('purchase.good', 'good')
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
        'delivery.id',
        'purchase.id',
        'good.id',
        'good.item',
        'good.description',
        'good.intake',
        'good.kit',
        'good.price',
        'purchase.amount',
      ])
      .getOne();
    return [
      ...hire.orders,
      ...hire.deliveries.map((delivery) => ({
        ...delivery.purchase.good,
        id: delivery.id,
        amount: delivery.purchase.amount,
      })),
    ];
  }

  async createHire(dto: ExtCreateHireDto): Promise<number> {
    const [box, userId] = await this.boxesService.reserveBox(dto);
    const hire = await this.create(
      { ...dto, stationId: box.id },
      box.station.price,
    );
    this.mqttService.publishNotification(
      hire.id,
      box.station.card.userId,
      userId,
      Notification.CREATED_HIRE,
    );
    this.addTimeout(hire.id, dto.myId, hire.completedAt);
    return hire.id;
  }

  async continueHire(dto: ExtHireIdDto): Promise<void> {
    const hire = await this.checkHireOwner(dto.hireId, dto.myId, dto.hasRole);
    const box = await this.boxesService.continueBox({
      ...dto,
      stationId: hire.boxId,
      cardId: hire.cardId,
    });
    await this.continue(hire, box.station.price);
    this.mqttService.publishNotification(
      dto.hireId,
      box.station.card.userId,
      hire.card.userId,
      Notification.CONTINUED_HIRE,
    );
    this.removeTimeout(hire.id);
    this.addTimeout(hire.id, dto.myId, hire.completedAt);
  }

  async completeHire(dto: ExtHireIdDto): Promise<void> {
    const hire = await this.checkHireOwner(dto.hireId, dto.myId, dto.hasRole);
    const box = await this.boxesService.unreserveBox(hire.boxId);
    await this.complete(hire);
    this.mqttService.publishNotification(
      dto.hireId,
      box.station.card.userId,
      hire.card.userId,
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
      relations: ['card', 'card.account', 'card.account.cards'],
      where: { id, card: { account: { cards: { completedAt: IsNull() } } } },
    });
    const card = hire.card.account.cards.find((card) => card.userId === userId);
    if (!card && !hasRole) {
      throw new AppException(HireError.NOT_OWNER);
    }
    if (hire.completedAt < new Date()) {
      throw new AppException(HireError.ALREADY_COMPLETED);
    }
    return hire;
  }

  private addTimeout(id: number, userId: number, date: Date): void {
    const before = new Date(date);
    before.setDate(before.getDate() - 3);
    const diffA = date.getTime() - new Date().getTime();
    const diffB = before.getTime() - new Date().getTime();
    const callbackFactory = (message: string) => () => {
      this.mqttService.publishNotification(id, userId, 0, message);
      return true;
    };
    const callbackA = callbackFactory(Notification.ENDED_HIRE);
    const callbackB = callbackFactory(Notification.REMINDED_HIRE);
    if (diffA < 24 * 60 * 60 * 1000) {
      this.schedule.scheduleTimeoutJob(`hires/${id}/a`, diffA, callbackA);
    }
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
        boxId: dto.stationId,
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
      .innerJoin('hire.box', 'box')
      .innerJoin('box.station', 'station')
      .innerJoin('station.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('hire.card', 'tenantCard')
      .innerJoin('tenantCard.account', 'tenantAccount')
      .innerJoin('tenantCard.user', 'tenantUser')
      .loadRelationCountAndMap('hire.orders', 'hire.orders')
      .loadRelationCountAndMap('hire.deliveries', 'hire.deliveries')
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
            .where(`${!req.box}`)
            .orWhere('box.id = :boxId', { boxId: req.box }),
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
        'box.id',
        'station.id',
        'ownerCard.id',
        'ownerAccount.id',
        'ownerAccount.name',
        'ownerAccount.color',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'station.name',
        'station.x',
        'station.y',
        'box.name',
        'tenantCard.id',
        'tenantAccount.id',
        'tenantAccount.name',
        'tenantAccount.color',
        'tenantUser.id',
        'tenantUser.nick',
        'tenantUser.avatar',
        'hire.sum',
        'hire.createdAt',
        'hire.completedAt',
      ]);
  }
}
