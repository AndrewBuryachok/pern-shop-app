import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
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
  constructor(
    @InjectRepository(Town)
    private townsRepository: Repository<Town>,
    private mqttService: MqttService,
  ) {}

  async getMainTowns(req: Request): Promise<Response<Town>> {
    const [result, count] = await this.getTownsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyTowns(myId: number, req: Request): Promise<Response<Town>> {
    const [result, count] = await this.getTownsQueryBuilder(req)
      .innerJoin('town.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllTowns(req: Request): Promise<Response<Town>> {
    const [result, count] = await this.getTownsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  getResidentsQueryBuilder(req: Request): SelectQueryBuilder<Town> {
    return this.getTownsQueryBuilder(req);
  }

  selectAllTowns(): Promise<Town[]> {
    return this.selectTownsQueryBuilder().getMany();
  }

  selectMyTowns(myId: number): Promise<Town[]> {
    return this.selectTownsQueryBuilder()
      .where('town.userId = :myId', { myId })
      .getMany();
  }

  async selectTownUsers(townId): Promise<User[]> {
    const town = await this.townsRepository
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

  async createTown(dto: ExtCreateTownDto & { nick: string }): Promise<void> {
    await this.checkNotInTown(dto.userId);
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    const town = await this.create(dto);
    this.mqttService.publishNotificationMessage(
      town.id,
      0,
      dto.nick,
      Notification.CREATED_TOWN,
    );
  }

  async editTown(dto: ExtEditTownDto): Promise<void> {
    const town = await this.checkTownOwner(dto.townId, dto.myId, dto.hasRole);
    await this.checkNameNotUsed(dto.name, dto.townId);
    await this.checkCoordinatesNotUsed(dto.x, dto.y, dto.townId);
    await this.edit(town, dto);
  }

  async deleteTown(dto: DeleteTownDto & { nick: string }): Promise<void> {
    const town = await this.checkTownOwner(dto.townId, dto.myId, dto.hasRole);
    await this.delete(town);
    town.users.forEach((user) =>
      this.mqttService.publishNotificationMessage(
        dto.townId,
        user.id,
        dto.nick,
        Notification.DELETED_TOWN,
      ),
    );
  }

  async checkTownExists(id: number): Promise<void> {
    await this.townsRepository.findOneByOrFail({ id });
  }

  async checkTownOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Town> {
    const town = await this.findTownById(id);
    if (town.userId !== userId && !hasRole) {
      throw new AppException(TownError.NOT_OWNER);
    }
    return town;
  }

  async checkHaveTown(userId: number): Promise<Town> {
    const town = await this.townsRepository.findOneBy({ userId });
    if (!town) {
      throw new AppException(TownError.NOT_HAVE);
    }
    return town;
  }

  async checkNotInTown(userId: number): Promise<void> {
    const town = await this.townsRepository.findOne({
      relations: ['users'],
      where: { users: [{ id: userId }] },
    });
    if (town) {
      throw new AppException(TownError.ALREADY_IN);
    }
  }

  async checkInTown(userId: number): Promise<Town> {
    const town = await this.townsRepository.findOne({
      relations: ['users'],
      where: { users: [{ id: userId }] },
    });
    if (!town) {
      throw new AppException(TownError.NOT_IN);
    }
    return town;
  }

  async findTownUserIdById(id: number): Promise<number> {
    const town = await this.townsRepository.findOneBy({ id });
    return town.userId;
  }

  private async checkNameNotUsed(name: string, id?: number): Promise<void> {
    const town = await this.townsRepository.findOneBy({ name });
    if (town && (!id || town.id !== id)) {
      throw new AppException(TownError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(
    x: number,
    y: number,
    id?: number,
  ): Promise<void> {
    const town = await this.townsRepository.findOneBy({ x, y });
    if (town && (!id || town.id !== id)) {
      throw new AppException(TownError.COORDINATES_ALREADY_USED);
    }
  }

  private findTownById(id: number): Promise<Town> {
    return this.townsRepository.findOne({
      relations: ['users'],
      where: { id },
    });
  }

  private async create(dto: ExtCreateTownDto): Promise<Town> {
    try {
      const town = this.townsRepository.create({
        userId: dto.userId,
        name: dto.name,
        image: dto.image,
        video: dto.video,
        description: dto.description,
        x: dto.x,
        y: dto.y,
        users: [{ id: dto.userId }],
      });
      await this.townsRepository.save(town);
      return town;
    } catch (error) {
      throw new AppException(TownError.CREATE_FAILED);
    }
  }

  private async edit(town: Town, dto: ExtEditTownDto): Promise<void> {
    try {
      town.name = dto.name;
      town.image = dto.image;
      town.video = dto.video;
      town.description = dto.description;
      town.x = dto.x;
      town.y = dto.y;
      await this.townsRepository.save(town);
    } catch (error) {
      throw new AppException(TownError.EDIT_FAILED);
    }
  }

  private async delete(town: Town): Promise<void> {
    try {
      await this.townsRepository.remove(town);
    } catch (error) {
      throw new AppException(TownError.DELETE_FAILED);
    }
  }

  private selectTownsQueryBuilder(): SelectQueryBuilder<Town> {
    return this.townsRepository
      .createQueryBuilder('town')
      .orderBy('town.name', 'ASC')
      .select(['town.id', 'town.name', 'town.x', 'town.y']);
  }

  private getTownsQueryBuilder(req: Request): SelectQueryBuilder<Town> {
    return this.townsRepository
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
        'town.image',
        'town.video',
        'town.description',
        'town.x',
        'town.y',
        'town.createdAt',
      ]);
  }
}
