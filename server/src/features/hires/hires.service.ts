import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
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
export class HiresService {
  constructor(
    @InjectRepository(Hire)
    private hiresRepository: Repository<Hire>,
    private drawersService: DrawersService,
    private mqttService: MqttService,
  ) {}

  async getMainHires(req: Request): Promise<Response<Hire>> {
    const [result, count] = await this.getHiresQueryBuilder(req)
      .andWhere('hire.completedAt > NOW()')
      .getManyAndCount();
    return { result, count };
  }

  async getMyHires(myId: number, req: Request): Promise<Response<Hire>> {
    const [result, count] = await this.getHiresQueryBuilder(req)
      .innerJoin('renterCard.users', 'renterUsers')
      .andWhere('renterUsers.id = :myId', { myId })
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
    const hire = await this.create({ ...dto, stationId: drawer.id });
    this.mqttService.publishNotificationMessage(
      hire.id,
      drawer.station.card.userId,
      dto.nick,
      Notification.CREATED_HIRE,
    );
    return hire.id;
  }

  async continueHire(dto: ExtHireIdDto & { nick: string }): Promise<void> {
    const hire = await this.checkHireOwner(dto.hireId, dto.myId, dto.hasRole);
    const drawer = await this.drawersService.continueDrawer({
      ...dto,
      stationId: hire.drawerId,
      cardId: hire.cardId,
    });
    await this.continue(hire);
    this.mqttService.publishNotificationMessage(
      dto.hireId,
      drawer.station.card.userId,
      dto.nick,
      Notification.CONTINUED_HIRE,
    );
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

  private async create(dto: ExtCreateHireDto): Promise<Hire> {
    try {
      const hire = this.hiresRepository.create({
        drawerId: dto.stationId,
        cardId: dto.cardId,
        completedAt: getDateWeekAfter(),
      });
      await this.hiresRepository.save(hire);
      return hire;
    } catch (error) {
      throw new AppException(HireError.CREATE_FAILED);
    }
  }

  private async continue(hire: Hire): Promise<void> {
    try {
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
      .innerJoin('hire.card', 'renterCard')
      .innerJoin('renterCard.user', 'renterUser')
      .leftJoin('station.states', 'state', 'state.createdAt < hire.createdAt')
      .leftJoin(
        'station.states',
        'next',
        'state.createdAt < next.createdAt AND next.createdAt < hire.createdAt',
      )
      .where('next.id IS NULL')
      .andWhere(
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
        'state.price',
        'drawer.name',
        'renterCard.id',
        'renterUser.id',
        'renterUser.nick',
        'renterUser.avatar',
        'renterCard.name',
        'renterCard.color',
        'hire.createdAt',
        'hire.completedAt',
      ]);
  }
}
