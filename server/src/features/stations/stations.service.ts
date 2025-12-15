import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, IsNull, Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
import { Station } from './station.entity';
import { MqttService } from '../mqtt/mqtt.service';
import { ExtCreateStationDto, ExtEditStationDto } from './station.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { StationError } from './station-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class StationsService {
  private stationsRepositoryMap: Map<string, Repository<Station>>;

  constructor(
    @InjectRepository(Station, Database.DB1)
    private stations1Repository: Repository<Station>,
    @InjectRepository(Station, Database.DB2)
    private stations2Repository: Repository<Station>,
    private mqttService: MqttService,
  ) {
    this.stationsRepositoryMap = new Map(
      [this.stations1Repository, this.stations2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMainStations(
    project: string,
    req: Request,
  ): Promise<Response<Station>> {
    const [result, count] = await this.getStationsQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyStations(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Station>> {
    const [result, count] = await this.getStationsQueryBuilder(project, req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllStations(
    project: string,
    req: Request,
  ): Promise<Response<Station>> {
    const [result, count] = await this.getStationsQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectAllStations(project: string): Promise<Station[]> {
    return this.selectStationsQueryBuilder(project).getMany();
  }

  async createStation(
    project: string,
    dto: ExtCreateStationDto,
  ): Promise<void> {
    await this.checkNameNotUsed(project, dto.name);
    await this.checkCoordinatesNotUsed(project, dto.x, dto.y);
    const station = await this.create(project, dto);
    this.mqttService.publishNotification(
      project,
      station.id,
      0,
      dto.userId,
      Notification.CREATED_STATION,
    );
  }

  async editStation(project: string, dto: ExtEditStationDto): Promise<void> {
    const station = await this.checkStationOwner(
      project,
      dto.stationId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(project, dto.name, dto.stationId);
    await this.checkCoordinatesNotUsed(project, dto.x, dto.y, dto.stationId);
    await this.edit(project, station, dto);
  }

  async checkStationExists(project: string, id: number): Promise<void> {
    await this.stationsRepositoryMap.get(project).findOneByOrFail({ id });
  }

  async checkStationOwner(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Station> {
    const station = await this.stationsRepositoryMap
      .get(project)
      .findOneBy({ id });
    if (station.userId !== userId && !hasRole) {
      throw new AppException(StationError.NOT_OWNER);
    }
    return station;
  }

  private async checkNameNotUsed(
    project: string,
    name: string,
    id?: number,
  ): Promise<void> {
    const station = await this.stationsRepositoryMap
      .get(project)
      .findOneBy({ name });
    if (station && (!id || station.id !== id)) {
      throw new AppException(StationError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(
    project: string,
    x: number,
    y: number,
    id?: number,
  ): Promise<void> {
    const station = await this.stationsRepositoryMap
      .get(project)
      .findOneBy({ x, y });
    if (station && (!id || station.id !== id)) {
      throw new AppException(StationError.COORDINATES_ALREADY_USED);
    }
  }

  private async create(
    project: string,
    dto: ExtCreateStationDto,
  ): Promise<Station> {
    try {
      const station = this.stationsRepositoryMap.get(project).create({
        userId: dto.userId,
        name: dto.name,
        description: dto.description,
        x: dto.x,
        y: dto.y,
      });
      await this.stationsRepositoryMap.get(project).save(station);
      return station;
    } catch (error) {
      throw new AppException(StationError.CREATE_FAILED);
    }
  }

  private async edit(
    project: string,
    station: Station,
    dto: ExtEditStationDto,
  ): Promise<void> {
    try {
      station.name = dto.name;
      station.description = dto.description;
      station.x = dto.x;
      station.y = dto.y;
      await this.stationsRepositoryMap.get(project).save(station);
    } catch (error) {
      throw new AppException(StationError.EDIT_FAILED);
    }
  }

  private selectStationsQueryBuilder(
    project: string,
  ): SelectQueryBuilder<Station> {
    return this.stationsRepositoryMap
      .get(project)
      .createQueryBuilder('station')
      .orderBy('station.name', 'ASC')
      .select(['station.id', 'station.name', 'station.x', 'station.y']);
  }

  private getStationsQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Station> {
    return this.stationsRepositoryMap
      .get(project)
      .createQueryBuilder('station')
      .innerJoin('station.user', 'ownerUser')
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
            .where(`${!req.station}`)
            .orWhere('station.id = :stationId', { stationId: req.station }),
        ),
      )
      .orderBy('station.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'station.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'station.name',
        'station.description',
        'station.x',
        'station.y',
        'station.createdAt',
      ]);
  }
}
