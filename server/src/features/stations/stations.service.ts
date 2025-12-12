import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Station } from './station.entity';
import { StationState } from './station-state.entity';
import { CardsService } from '../cards/cards.service';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateStationDto, ExtEditStationDto } from './station.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { StationError } from './station-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class StationsService {
  constructor(
    @InjectRepository(Station)
    private stationsRepository: Repository<Station>,
    @InjectRepository(StationState)
    private stationsStatesRepository: Repository<StationState>,
    private cardsService: CardsService,
    private mqttService: MqttService,
  ) {}

  async getMainStations(req: Request): Promise<Response<Station>> {
    const [result, count] = await this.getStationsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyStations(myId: number, req: Request): Promise<Response<Station>> {
    const [result, count] = await this.getStationsQueryBuilder(req)
      .innerJoin('ownerAccount.cards', 'ownerCards')
      .andWhere('ownerCards.userId = :myId', { myId })
      .andWhere('ownerCards.completedAt IS NULL')
      .getManyAndCount();
    return { result, count };
  }

  async getAllStations(req: Request): Promise<Response<Station>> {
    const [result, count] = await this.getStationsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectAllStations(): Promise<Station[]> {
    return this.selectStationsQueryBuilder().getMany();
  }

  async selectStationStates(stationId: number): Promise<StationState[]> {
    const station = await this.stationsRepository
      .createQueryBuilder('station')
      .leftJoin('station.states', 'state')
      .where('station.id = :stationId', { stationId })
      .orderBy('state.id', 'DESC')
      .select([
        'station.id',
        'station.price',
        'state.id',
        'state.price',
        'state.createdAt',
      ])
      .getOne();
    return station.states;
  }

  async createStation(dto: ExtCreateStationDto): Promise<void> {
    const card = await this.cardsService.checkCardUser(
      dto.cardId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    const station = await this.create(dto);
    this.mqttService.publishNotification(
      station.id,
      0,
      card.userId,
      Notification.CREATED_STATION,
    );
  }

  async editStation(dto: ExtEditStationDto): Promise<void> {
    const station = await this.checkStationOwner(
      dto.stationId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(dto.name, dto.stationId);
    await this.checkCoordinatesNotUsed(dto.x, dto.y, dto.stationId);
    await this.edit(station, dto);
  }

  async checkStationExists(id: number): Promise<void> {
    await this.stationsRepository.findOneByOrFail({ id });
  }

  async checkStationOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Station> {
    const station = await this.stationsRepository.findOne({
      relations: ['card', 'card.account', 'card.account.cards'],
      where: { id, card: { account: { cards: { completedAt: IsNull() } } } },
    });
    const card = station.card.account.cards.find(
      (card) => card.userId === userId,
    );
    if (!card && !hasRole) {
      throw new AppException(StationError.NOT_OWNER);
    }
    return station;
  }

  private async checkNameNotUsed(name: string, id?: number): Promise<void> {
    const station = await this.stationsRepository.findOneBy({ name });
    if (station && (!id || station.id !== id)) {
      throw new AppException(StationError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(
    x: number,
    y: number,
    id?: number,
  ): Promise<void> {
    const station = await this.stationsRepository.findOneBy({ x, y });
    if (station && (!id || station.id !== id)) {
      throw new AppException(StationError.COORDINATES_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateStationDto): Promise<Station> {
    try {
      const station = this.stationsRepository.create({
        cardId: dto.cardId,
        name: dto.name,
        description: dto.description,
        x: dto.x,
        y: dto.y,
        price: dto.price,
      });
      await this.stationsRepository.save(station);
      const stationState = this.stationsStatesRepository.create({
        stationId: station.id,
        price: station.price,
      });
      await this.stationsStatesRepository.save(stationState);
      return station;
    } catch (error) {
      throw new AppException(StationError.CREATE_FAILED);
    }
  }

  private async edit(station: Station, dto: ExtEditStationDto): Promise<void> {
    try {
      const equal = station.price === dto.price;
      station.name = dto.name;
      station.description = dto.description;
      station.x = dto.x;
      station.y = dto.y;
      station.price = dto.price;
      await this.stationsRepository.save(station);
      if (!equal) {
        const stationState = this.stationsStatesRepository.create({
          stationId: station.id,
          price: station.price,
        });
        await this.stationsStatesRepository.save(stationState);
      }
    } catch (error) {
      throw new AppException(StationError.EDIT_FAILED);
    }
  }

  private selectStationsQueryBuilder(): SelectQueryBuilder<Station> {
    return this.stationsRepository
      .createQueryBuilder('station')
      .orderBy('station.name', 'ASC')
      .select(['station.id', 'station.name', 'station.x', 'station.y']);
  }

  private getStationsQueryBuilder(req: Request): SelectQueryBuilder<Station> {
    return this.stationsRepository
      .createQueryBuilder('station')
      .innerJoin('station.card', 'ownerCard')
      .innerJoin('ownerCard.account', 'ownerAccount')
      .innerJoin('ownerCard.user', 'ownerUser')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('station.id = :id', { id: req.id }),
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
            .where(`${!req.minPrice}`)
            .orWhere('station.price >= :minPrice', { minPrice: req.minPrice }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxPrice}`)
            .orWhere('station.price <= :maxPrice', { maxPrice: req.maxPrice }),
        ),
      )
      .orderBy('station.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'station.id',
        'ownerCard.id',
        'ownerAccount.id',
        'ownerAccount.name',
        'ownerAccount.color',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'station.name',
        'station.description',
        'station.x',
        'station.y',
        'station.price',
        'station.createdAt',
      ]);
  }
}
