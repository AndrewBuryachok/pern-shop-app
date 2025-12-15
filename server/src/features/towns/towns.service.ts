import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Database } from '../../database.enum';
import { Town } from './town.entity';
import { User } from '../users/user.entity';
import { MqttService } from '../mqtt/mqtt.service';
import { DeleteTownDto, ExtCreateTownDto, ExtEditTownDto } from './town.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { TownError } from './town-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class TownsService {
  private townsRepositoryMap: Map<string, Repository<Town>>;

  constructor(
    @InjectRepository(Town, Database.DB1)
    private towns1Repository: Repository<Town>,
    @InjectRepository(Town, Database.DB2)
    private towns2Repository: Repository<Town>,
    private mqttService: MqttService,
  ) {
    this.townsRepositoryMap = new Map(
      [this.towns1Repository, this.towns2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMainTowns(project: string, req: Request): Promise<Response<Town>> {
    const [result, count] = await this.getTownsQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyTowns(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<Town>> {
    const [result, count] = await this.getTownsQueryBuilder(project, req)
      .innerJoin('town.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllTowns(project: string, req: Request): Promise<Response<Town>> {
    const [result, count] = await this.getTownsQueryBuilder(
      project,
      req,
    ).getManyAndCount();
    return { result, count };
  }

  getResidentsQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Town> {
    return this.getTownsQueryBuilder(project, req);
  }

  selectAllTowns(project: string): Promise<Town[]> {
    return this.selectTownsQueryBuilder(project).getMany();
  }

  selectMyTowns(project: string, myId: number): Promise<Town[]> {
    return this.selectTownsQueryBuilder(project)
      .where('town.userId = :myId', { myId })
      .getMany();
  }

  async selectTownUsers(project: string, townId: number): Promise<User[]> {
    const town = await this.townsRepositoryMap
      .get(project)
      .createQueryBuilder('town')
      .leftJoin('town.users', 'user')
      .where('town.id = :townId', { townId })
      .orderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.nick', 'ASC')
      .select(['town.id', 'user.id', 'user.nick', 'user.avatar'])
      .getOne();
    return town.users;
  }

  async createTown(project: string, dto: ExtCreateTownDto): Promise<void> {
    await this.checkNotInTown(project, dto.userId);
    await this.checkNameNotUsed(project, dto.name);
    await this.checkCoordinatesNotUsed(project, dto.x, dto.y);
    const town = await this.create(project, dto);
    this.mqttService.publishNotification(
      project,
      town.id,
      0,
      dto.userId,
      Notification.CREATED_TOWN,
    );
  }

  async editTown(project: string, dto: ExtEditTownDto): Promise<void> {
    const town = await this.checkTownOwner(
      project,
      dto.townId,
      dto.myId,
      dto.hasRole,
    );
    await this.checkNameNotUsed(project, dto.name, dto.townId);
    await this.checkCoordinatesNotUsed(project, dto.x, dto.y, dto.townId);
    await this.edit(project, town, dto);
  }

  async deleteTown(project: string, dto: DeleteTownDto): Promise<void> {
    const town = await this.checkTownOwner(
      project,
      dto.townId,
      dto.myId,
      dto.hasRole,
    );
    await this.delete(project, town);
    town.users.forEach((user) =>
      this.mqttService.publishNotification(
        project,
        dto.townId,
        user.id,
        town.userId,
        Notification.DELETED_TOWN,
      ),
    );
  }

  async checkTownExists(project: string, id: number): Promise<void> {
    await this.townsRepositoryMap.get(project).findOneByOrFail({ id });
  }

  async checkTownOwner(
    project: string,
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Town> {
    const town = await this.findTownById(project, id);
    if (town.userId !== userId && !hasRole) {
      throw new AppException(TownError.NOT_OWNER);
    }
    return town;
  }

  async checkHaveTown(project: string, userId: number): Promise<Town> {
    const town = await this.townsRepositoryMap
      .get(project)
      .findOneBy({ userId });
    if (!town) {
      throw new AppException(TownError.NOT_HAVE);
    }
    return town;
  }

  async checkNotInTown(project: string, userId: number): Promise<void> {
    const town = await this.townsRepositoryMap.get(project).findOne({
      relations: ['users'],
      where: { users: [{ id: userId }] },
    });
    if (town) {
      throw new AppException(TownError.ALREADY_IN);
    }
  }

  async checkInTown(project: string, userId: number): Promise<Town> {
    const town = await this.townsRepositoryMap.get(project).findOne({
      relations: ['users'],
      where: { users: [{ id: userId }] },
    });
    if (!town) {
      throw new AppException(TownError.NOT_IN);
    }
    return town;
  }

  async findTownUserIdById(project: string, id: number): Promise<number> {
    const town = await this.townsRepositoryMap.get(project).findOneBy({ id });
    return town.userId;
  }

  private async checkNameNotUsed(
    project: string,
    name: string,
    id?: number,
  ): Promise<void> {
    const town = await this.townsRepositoryMap.get(project).findOneBy({ name });
    if (town && (!id || town.id !== id)) {
      throw new AppException(TownError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(
    project: string,
    x: number,
    y: number,
    id?: number,
  ): Promise<void> {
    const town = await this.townsRepositoryMap.get(project).findOneBy({ x, y });
    if (town && (!id || town.id !== id)) {
      throw new AppException(TownError.COORDINATES_ALREADY_USED);
    }
  }

  private findTownById(project: string, id: number): Promise<Town> {
    return this.townsRepositoryMap.get(project).findOne({
      relations: ['users'],
      where: { id },
    });
  }

  private async create(project: string, dto: ExtCreateTownDto): Promise<Town> {
    try {
      const town = this.townsRepositoryMap.get(project).create({
        userId: dto.userId,
        name: dto.name,
        description: dto.description,
        x: dto.x,
        y: dto.y,
        users: [{ id: dto.userId }],
      });
      await this.townsRepositoryMap.get(project).save(town);
      return town;
    } catch (error) {
      throw new AppException(TownError.CREATE_FAILED);
    }
  }

  private async edit(
    project: string,
    town: Town,
    dto: ExtEditTownDto,
  ): Promise<void> {
    try {
      town.name = dto.name;
      town.description = dto.description;
      town.x = dto.x;
      town.y = dto.y;
      await this.townsRepositoryMap.get(project).save(town);
    } catch (error) {
      throw new AppException(TownError.EDIT_FAILED);
    }
  }

  private async delete(project: string, town: Town): Promise<void> {
    try {
      await this.townsRepositoryMap.get(project).remove(town);
    } catch (error) {
      throw new AppException(TownError.DELETE_FAILED);
    }
  }

  private selectTownsQueryBuilder(project: string): SelectQueryBuilder<Town> {
    return this.townsRepositoryMap
      .get(project)
      .createQueryBuilder('town')
      .orderBy('town.name', 'ASC')
      .select(['town.id', 'town.name', 'town.x', 'town.y']);
  }

  private getTownsQueryBuilder(
    project: string,
    req: Request,
  ): SelectQueryBuilder<Town> {
    return this.townsRepositoryMap
      .get(project)
      .createQueryBuilder('town')
      .innerJoin('town.user', 'ownerUser')
      .loadRelationCountAndMap('town.users', 'town.users')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('town.id = :id', { id: req.id }),
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
            .where(`${!req.town}`)
            .orWhere('town.id = :townId', { townId: req.town }),
        ),
      )
      .orderBy('town.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'town.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'town.name',
        'town.description',
        'town.x',
        'town.y',
        'town.createdAt',
      ]);
  }
}
