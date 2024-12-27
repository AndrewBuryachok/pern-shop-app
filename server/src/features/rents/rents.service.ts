import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { InjectSchedule, Schedule } from 'nest-schedule';
import { Rent } from './rent.entity';
import { Thing } from '../things/thing.entity';
import { StallsService } from '../stalls/stalls.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateRentDto, ExtRentIdDto } from './rent.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAfter } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { RentError } from './rent-error.enum';
import { Mode, Notification } from '../../common/enums';

@Injectable()
export class RentsService implements OnModuleInit {
  constructor(
    @InjectRepository(Rent)
    private rentsRepository: Repository<Rent>,
    private stallsService: StallsService,
    private mqttService: MqttService,
    @InjectSchedule()
    private schedule: Schedule,
  ) {}

  async onModuleInit() {
    const rents = await this.rentsRepository
      .createQueryBuilder('rent')
      .innerJoinAndSelect('rent.card', 'card')
      .where('rent.completedAt > NOW()')
      .getMany();
    rents.forEach((rent) =>
      this.addTimeout(rent.id, rent.card.userId, rent.completedAt),
    );
  }

  async getMainRents(req: Request): Promise<Response<Rent>> {
    const [result, count] = await this.getRentsQueryBuilder(req)
      .andWhere('rent.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyRents(myId: number, req: Request): Promise<Response<Rent>> {
    const [result, count] = await this.getRentsQueryBuilder(req)
      .innerJoin('tenantCard.users', 'tenantUsers')
      .andWhere('tenantUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedRents(myId: number, req: Request): Promise<Response<Rent>> {
    const [result, count] = await this.getRentsQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllRents(req: Request): Promise<Response<Rent>> {
    const [result, count] = await this.getRentsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectAllRents(): Promise<Rent[]> {
    return this.selectRentsQueryBuilder().getMany();
  }

  selectMyRents(myId: number): Promise<Rent[]> {
    return this.selectRentsQueryBuilder()
      .innerJoin('rent.card', 'tenantCard')
      .innerJoin('tenantCard.users', 'tenantUsers')
      .andWhere('tenantUsers.id = :myId', { myId })
      .getMany();
  }

  async selectRentThings(rentId: number): Promise<Thing[]> {
    const rent = await this.rentsRepository
      .createQueryBuilder('rent')
      .leftJoin('rent.goods', 'good')
      .where('rent.id = :rentId', { rentId })
      .orderBy('good.id', 'DESC')
      .select([
        'rent.id',
        'good.id',
        'good.item',
        'good.description',
        'good.amount',
        'good.intake',
        'good.kit',
        'good.price',
      ])
      .getOne();
    return rent.goods;
  }

  async createRent(dto: ExtCreateRentDto & { nick: string }): Promise<void> {
    const stall = await this.stallsService.reserveStall(dto);
    const rent = await this.create(dto, stall.marketTag.price);
    this.mqttService.publishNotificationMessage(
      rent.id,
      stall.market.card.userId,
      dto.nick,
      Notification.CREATED_RENT,
    );
    this.addTimeout(rent.id, dto.myId, rent.completedAt);
  }

  async continueRent(dto: ExtRentIdDto & { nick: string }): Promise<void> {
    const rent = await this.checkRentOwner(dto.rentId, dto.myId, dto.hasRole);
    const stall = await this.stallsService.continueStall({
      ...dto,
      stallId: rent.stallId,
      cardId: rent.cardId,
    });
    await this.continue(rent, stall.marketTag.price);
    this.mqttService.publishNotificationMessage(
      dto.rentId,
      stall.market.card.userId,
      dto.nick,
      Notification.CONTINUED_RENT,
    );
    this.removeTimeout(rent.id);
    this.addTimeout(rent.id, dto.myId, rent.completedAt);
  }

  async completeRent(dto: ExtRentIdDto & { nick: string }): Promise<void> {
    const rent = await this.checkRentOwner(dto.rentId, dto.myId, dto.hasRole);
    const stall = await this.stallsService.unreserveStall(rent.stallId);
    await this.complete(rent);
    this.mqttService.publishNotificationMessage(
      dto.rentId,
      stall.market.card.userId,
      dto.nick,
      Notification.COMPLETED_RENT,
    );
    this.removeTimeout(rent.id);
  }

  async checkRentExists(id: number): Promise<void> {
    await this.rentsRepository.findOneByOrFail({ id });
  }

  async checkRentOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Rent> {
    const rent = await this.rentsRepository.findOne({
      relations: ['card', 'card.users'],
      where: { id },
    });
    if (!rent.card.users.map((user) => user.id).includes(userId) && !hasRole) {
      throw new AppException(RentError.NOT_OWNER);
    }
    if (rent.completedAt < new Date()) {
      throw new AppException(RentError.ALREADY_COMPLETED);
    }
    return rent;
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
    const callbackA = callbackFactory(Notification.ENDED_RENT);
    const callbackB = callbackFactory(Notification.REMINDED_RENT);
    this.schedule.scheduleTimeoutJob(`rents/${id}/a`, diffA, callbackA);
    if (diffB > 0) {
      this.schedule.scheduleTimeoutJob(`rents/${id}/b`, diffB, callbackB);
    }
  }

  private removeTimeout(id: number): void {
    this.schedule.cancelJob(`rents/${id}/a`);
    this.schedule.cancelJob(`rents/${id}/b`);
  }

  private async create(dto: ExtCreateRentDto, sum: number): Promise<Rent> {
    try {
      const rent = this.rentsRepository.create({
        stallId: dto.stallId,
        cardId: dto.cardId,
        sum,
        completedAt: getDateWeekAfter(),
      });
      await this.rentsRepository.save(rent);
      return rent;
    } catch (error) {
      throw new AppException(RentError.CREATE_FAILED);
    }
  }

  private async continue(rent: Rent, price: number): Promise<void> {
    try {
      rent.sum += price;
      rent.completedAt.setDate(rent.completedAt.getDate() + 7);
      await this.rentsRepository.save(rent);
    } catch (error) {
      throw new AppException(RentError.CONTINUE_FAILED);
    }
  }

  private async complete(rent: Rent): Promise<void> {
    try {
      rent.completedAt = new Date();
      await this.rentsRepository.save(rent);
    } catch (error) {
      throw new AppException(RentError.COMPLETE_FAILED);
    }
  }

  private selectRentsQueryBuilder(): SelectQueryBuilder<Rent> {
    return this.rentsRepository
      .createQueryBuilder('rent')
      .innerJoin('rent.stall', 'stall')
      .innerJoin('stall.market', 'market')
      .where('rent.completedAt > NOW()')
      .orderBy('rent.id', 'DESC')
      .select([
        'rent.id',
        'stall.id',
        'market.id',
        'market.name',
        'market.x',
        'market.y',
        'stall.name',
      ]);
  }

  private getRentsQueryBuilder(req: Request): SelectQueryBuilder<Rent> {
    return this.rentsRepository
      .createQueryBuilder('rent')
      .innerJoin('rent.stall', 'stall')
      .innerJoin('stall.marketTag', 'marketTag')
      .innerJoin('stall.market', 'market')
      .innerJoin('market.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .innerJoin('rent.card', 'tenantCard')
      .innerJoin('tenantCard.user', 'tenantUser')
      .loadRelationCountAndMap('rent.things', 'rent.goods', 'good', (qb) =>
        qb.where('good.amount > 0'),
      )
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('rent.id = :id', { id: req.id }),
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
            .where(`${!req.market}`)
            .orWhere('market.id = :marketId', { marketId: req.market }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.marketTag}`).orWhere('marketTag.id = :marketTagId', {
            marketTagId: req.marketTag,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.stall}`)
            .orWhere('stall.id = :stallId', { stallId: req.stall }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minSum}`)
            .orWhere('rent.sum >= :minSum', { minSum: req.minSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxSum}`)
            .orWhere('rent.sum <= :maxSum', { maxSum: req.maxSum }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.minDate}`)
            .orWhere('rent.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('rent.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('rent.completedAt < NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('rent.completedAt > NOW()'),
        ),
      )
      .orderBy('rent.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'rent.id',
        'stall.id',
        'market.id',
        'ownerCard.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'ownerCard.name',
        'ownerCard.color',
        'market.name',
        'market.x',
        'market.y',
        'stall.name',
        'tenantCard.id',
        'tenantUser.id',
        'tenantUser.nick',
        'tenantUser.avatar',
        'tenantCard.name',
        'tenantCard.color',
        'rent.sum',
        'rent.createdAt',
        'rent.completedAt',
      ]);
  }
}
