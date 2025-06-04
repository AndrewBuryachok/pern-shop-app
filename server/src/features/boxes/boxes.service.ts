import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Box } from './box.entity';
import { Station } from '../stations/station.entity';
import { StationsService } from '../stations/stations.service';
import { PaymentsService } from '../payments/payments.service';
import { ExtCreateBoxDto, ReserveBoxDto } from './box.dto';
import { Request, Response } from '../../common/interfaces';
import { getDateWeekAfter } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { BoxError } from './box-error.enum';

@Injectable()
export class BoxesService {
  constructor(
    @InjectRepository(Box)
    private boxesRepository: Repository<Box>,
    private stationsService: StationsService,
    private paymentsService: PaymentsService,
  ) {}

  async getMainBoxes(req: Request): Promise<Response<Box>> {
    const [result, count] = await this.getBoxesQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('box.reservedUntil IS NULL')
            .orWhere('box.reservedUntil < NOW()'),
        ),
      )
      .getManyAndCount();
    return { result, count };
  }

  async getMyBoxes(myId: number, req: Request): Promise<Response<Box>> {
    const [result, count] = await this.getBoxesQueryBuilder(req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllBoxes(req: Request): Promise<Response<Box>> {
    const [result, count] = await this.getBoxesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectStationBoxes(stationId: number): Promise<Box[]> {
    return this.selectBoxesQueryBuilder()
      .where('box.stationId = :stationId', { stationId })
      .getMany();
  }

  async selectBoxStation(boxId: number): Promise<Station> {
    const box = await this.boxesRepository
      .createQueryBuilder('box')
      .innerJoin('box.station', 'station')
      .where('box.id = :boxId', { boxId })
      .select(['box.id', 'station.id', 'station.name', 'station.price'])
      .getOne();
    return box.station;
  }

  async createBox(dto: ExtCreateBoxDto): Promise<void> {
    await this.stationsService.checkStationOwner(
      dto.stationId,
      dto.myId,
      dto.hasRole,
    );
    const name = (await this.countStationBoxes(dto.stationId)) + 1;
    await this.create({ ...dto, name });
  }

  async reserveBox(dto: ReserveBoxDto): Promise<[Box, number]> {
    const box = await this.findFreeBox(dto.stationId);
    const userId = await this.paymentsService.createPaymentWithReturn({
      myId: dto.myId,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: box.station.cardId,
      sum: box.station.price,
      description: '',
    });
    await this.reserve(box);
    return [box, userId];
  }

  async continueBox(dto: ReserveBoxDto): Promise<Box> {
    const box = await this.boxesRepository.findOne({
      relations: ['station', 'station.card'],
      where: { id: dto.stationId },
    });
    await this.paymentsService.createPayment({
      myId: dto.myId,
      hasRole: dto.hasRole,
      senderCardId: dto.cardId,
      receiverCardId: box.station.cardId,
      sum: box.station.price,
      description: '',
    });
    await this.continue(box);
    return box;
  }

  async unreserveBox(id: number): Promise<Box> {
    const box = await this.boxesRepository.findOne({
      relations: ['station', 'station.card'],
      where: { id },
    });
    await this.unreserve(box);
    return box;
  }

  async checkBoxExists(id: number): Promise<void> {
    await this.boxesRepository.findOneByOrFail({ id });
  }

  private countStationBoxes(stationId: number): Promise<number> {
    return this.boxesRepository.countBy({ stationId });
  }

  private async findFreeBox(stationId: number): Promise<Box> {
    const box = await this.boxesRepository
      .createQueryBuilder('box')
      .innerJoinAndSelect('box.station', 'station')
      .innerJoinAndSelect('station.card', 'card')
      .where('station.id = :stationId', { stationId })
      .andWhere(
        new Brackets((qb) =>
          qb
            .where('box.reservedUntil IS NULL')
            .orWhere('box.reservedUntil < NOW()'),
        ),
      )
      .orderBy('RANDOM()')
      .getOne();
    if (!box) {
      throw new AppException(BoxError.NO_FREE);
    }
    return box;
  }

  private async create(dto: ExtCreateBoxDto): Promise<Box> {
    try {
      const box = this.boxesRepository.create({
        stationId: dto.stationId,
        name: dto.name,
      });
      await this.boxesRepository.save(box);
      return box;
    } catch (error) {
      throw new AppException(BoxError.CREATE_FAILED);
    }
  }

  private async reserve(box: Box): Promise<void> {
    try {
      box.reservedUntil = getDateWeekAfter();
      await this.boxesRepository.save(box);
    } catch (error) {
      throw new AppException(BoxError.RESERVE_FAILED);
    }
  }

  private async continue(box: Box): Promise<void> {
    try {
      box.reservedUntil.setDate(box.reservedUntil.getDate() + 7);
      await this.boxesRepository.save(box);
    } catch (error) {
      throw new AppException(BoxError.CONTINUE_FAILED);
    }
  }

  private async unreserve(box: Box): Promise<void> {
    try {
      box.reservedUntil = new Date();
      await this.boxesRepository.save(box);
    } catch (error) {
      throw new AppException(BoxError.UNRESERVE_FAILED);
    }
  }

  private selectBoxesQueryBuilder(): SelectQueryBuilder<Box> {
    return this.boxesRepository
      .createQueryBuilder('box')
      .orderBy('box.name', 'ASC')
      .select(['box.id', 'box.name']);
  }

  private getBoxesQueryBuilder(req: Request): SelectQueryBuilder<Box> {
    return this.boxesRepository
      .createQueryBuilder('box')
      .innerJoin('box.station', 'station')
      .innerJoin('station.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('box.id = :id', { id: req.id }),
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
            .where(`${!req.box}`)
            .orWhere('box.id = :boxId', { boxId: req.box }),
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
            .orWhere('box.reservedUntil IS NULL')
            .orWhere('box.reservedUntil < NOW()'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${req.completed !== -1}`)
            .orWhere('box.reservedUntil > NOW()'),
        ),
      )
      .orderBy('box.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
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
        'station.price',
        'box.name',
        'box.reservedUntil',
      ]);
  }
}
