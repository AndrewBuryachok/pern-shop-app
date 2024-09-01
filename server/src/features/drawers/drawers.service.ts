import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Drawer } from './drawer.entity';
import { Station } from '../stations/station.entity';
import { StationsService } from '../stations/stations.service';
import { PaymentsService } from '../payments/payments.service';
import { ExtCreateDrawerDto, ReserveDrawerDto } from './drawer.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAfter } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { DrawerError } from './drawer-error.enum';

@Injectable()
export class DrawersService {
  constructor(
    @InjectRepository(Drawer)
    private drawersRepository: Repository<Drawer>,
    private stationsService: StationsService,
    private paymentsService: PaymentsService,
  ) {}

  async getMainDrawers(req: Request): Promise<Response<Drawer>> {
    const [result, count] = await this.getDrawersQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('drawer.reservedUntil IS NULL')
            .orWhere('drawer.reservedUntil < NOW()'),
        ),
      )
      .getManyAndCount();
    return { result, count };
  }

  async getMyDrawers(myId: number, req: Request): Promise<Response<Drawer>> {
    const [result, count] = await this.getDrawersQueryBuilder(req)
      .innerJoin('ownerCard.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllDrawers(req: Request): Promise<Response<Drawer>> {
    const [result, count] = await this.getDrawersQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectStationDrawers(stationId: number): Promise<Drawer[]> {
    return this.selectDrawersQueryBuilder()
      .where('drawer.stationId = :stationId', { stationId })
      .getMany();
  }

  async selectDrawerStation(drawerId: number): Promise<Station> {
    const drawer = await this.drawersRepository
      .createQueryBuilder('drawer')
      .innerJoin('drawer.station', 'station')
      .where('drawer.id = :drawerId', { drawerId })
      .select(['drawer.id', 'station.id', 'station.name', 'station.price'])
      .getOne();
    return drawer.station;
  }

  async createDrawer(dto: ExtCreateDrawerDto): Promise<void> {
    await this.stationsService.checkStationOwner(
      dto.stationId,
      dto.myId,
      dto.hasRole,
    );
    const name = (await this.countStationDrawers(dto.stationId)) + 1;
    await this.create({ ...dto, name });
  }

  async reserveDrawer(
    dto: ReserveDrawerDto & { nick: string },
  ): Promise<Drawer> {
    const drawer = await this.findFreeDrawer(dto.stationId);
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: drawer.station.cardId,
      sum: drawer.station.price,
      description: '',
    });
    await this.reserve(drawer);
    return drawer;
  }

  async continueDrawer(
    dto: ReserveDrawerDto & { nick: string },
  ): Promise<Drawer> {
    const drawer = await this.drawersRepository.findOne({
      relations: ['station', 'station.card'],
      where: { id: dto.stationId },
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      nick: dto.nick,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: drawer.station.cardId,
      sum: drawer.station.price,
      description: '',
    });
    await this.continue(drawer);
    return drawer;
  }

  async unreserveDrawer(id: number): Promise<Drawer> {
    const drawer = await this.drawersRepository.findOne({
      relations: ['station', 'station.card'],
      where: { id },
    });
    await this.unreserve(drawer);
    return drawer;
  }

  async checkDrawerExists(id: number): Promise<void> {
    await this.drawersRepository.findOneByOrFail({ id });
  }

  private countStationDrawers(stationId: number): Promise<number> {
    return this.drawersRepository.countBy({ stationId });
  }

  private async findFreeDrawer(stationId: number): Promise<Drawer> {
    const drawer = await this.drawersRepository
      .createQueryBuilder('drawer')
      .innerJoinAndSelect('drawer.station', 'station')
      .innerJoinAndSelect('station.card', 'card')
      .where('station.id = :stationId', { stationId })
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('drawer.reservedUntil IS NULL')
            .orWhere('drawer.reservedUntil < NOW()'),
        ),
      )
      .orderBy('RANDOM()')
      .getOne();
    if (!drawer) {
      throw new AppException(DrawerError.NO_FREE);
    }
    return drawer;
  }

  private async create(dto: ExtCreateDrawerDto): Promise<Drawer> {
    try {
      const drawer = this.drawersRepository.create({
        stationId: dto.stationId,
        name: dto.name,
      });
      await this.drawersRepository.save(drawer);
      return drawer;
    } catch (error) {
      throw new AppException(DrawerError.CREATE_FAILED);
    }
  }

  private async reserve(drawer: Drawer): Promise<void> {
    try {
      drawer.reservedUntil = getDateWeekAfter();
      await this.drawersRepository.save(drawer);
    } catch (error) {
      throw new AppException(DrawerError.RESERVE_FAILED);
    }
  }

  private async continue(drawer: Drawer): Promise<void> {
    try {
      drawer.reservedUntil.setDate(drawer.reservedUntil.getDate() + 7);
      await this.drawersRepository.save(drawer);
    } catch (error) {
      throw new AppException(DrawerError.CONTINUE_FAILED);
    }
  }

  private async unreserve(drawer: Drawer): Promise<void> {
    try {
      drawer.reservedUntil = new Date();
      await this.drawersRepository.save(drawer);
    } catch (error) {
      throw new AppException(DrawerError.UNRESERVE_FAILED);
    }
  }

  private selectDrawersQueryBuilder(): SelectQueryBuilder<Drawer> {
    return this.drawersRepository
      .createQueryBuilder('drawer')
      .orderBy('drawer.name', 'ASC')
      .select(['drawer.id', 'drawer.name']);
  }

  private getDrawersQueryBuilder(req: Request): SelectQueryBuilder<Drawer> {
    return this.drawersRepository
      .createQueryBuilder('drawer')
      .innerJoin('drawer.station', 'station')
      .innerJoin('station.card', 'ownerCard')
      .innerJoin('ownerCard.user', 'ownerUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('drawer.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere('ownerUser.id = :userId', { userId: req.user }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.card}`)
            .orWhere('ownerCard.id = :cardId', { cardId: req.card }),
        ),
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
          qb.where(`${!req.minPrice}`).orWhere('station.price >= :minPrice', {
            minPrice: req.minPrice,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${!req.maxPrice}`).orWhere('station.price <= :maxPrice', {
            maxPrice: req.maxPrice,
          }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== 1}`)
            .orWhere('drawer.reservedUntil IS NULL')
            .orWhere('drawer.reservedUntil < NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('drawer.reservedUntil > NOW()'),
        ),
      )
      .orderBy('drawer.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
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
        'station.price',
        'drawer.name',
        'drawer.reservedUntil',
      ]);
  }
}
