import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Farm } from './farm.entity';
import { User } from '../users/user.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateFarmDto,
  ExtEditFarmDto,
  ExtUpdateFarmUserDto,
} from './farm.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { FarmError } from './farm-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class FarmsService {
  constructor(
    @InjectRepository(Farm)
    private farmsRepository: Repository<Farm>,
    private mqttService: MqttService,
  ) {}

  async getMainFarms(req: Request): Promise<Response<Farm>> {
    const [result, count] = await this.getFarmsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyFarms(myId: number, req: Request): Promise<Response<Farm>> {
    const [result, count] = await this.getFarmsQueryBuilder(req)
      .innerJoin('farm.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllFarms(req: Request): Promise<Response<Farm>> {
    const [result, count] = await this.getFarmsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectAllFarms(): Promise<Farm[]> {
    return this.selectFarmsQueryBuilder().getMany();
  }

  async selectFarmUsers(farmId: number): Promise<User[]> {
    const farm = await this.farmsRepository
      .createQueryBuilder('farm')
      .leftJoin('farm.users', 'user')
      .where('farm.id = :farmId', { farmId })
      .orderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.nick', 'ASC')
      .select(['farm.id', 'user.id', 'user.nick', 'user.avatar'])
      .getOne();
    return farm.users;
  }

  async createFarm(dto: ExtCreateFarmDto & { nick: string }): Promise<void> {
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    const farm = await this.create(dto);
    this.mqttService.publishNotificationMessage(
      farm.id,
      0,
      dto.nick,
      Notification.CREATED_FARM,
    );
  }

  async editFarm(dto: ExtEditFarmDto): Promise<void> {
    const farm = await this.checkFarmOwner(dto.farmId, dto.myId, dto.hasRole);
    await this.checkNameNotUsed(dto.name, dto.farmId);
    await this.checkCoordinatesNotUsed(dto.x, dto.y, dto.farmId);
    await this.edit(farm, dto);
  }

  async addFarmUser(
    dto: ExtUpdateFarmUserDto & { nick: string },
  ): Promise<void> {
    const farm = await this.checkFarmOwner(dto.farmId, dto.myId, dto.hasRole);
    if (farm.users.map((user) => user.id).includes(dto.userId)) {
      throw new AppException(FarmError.ALREADY_IN_FARM);
    }
    await this.addUser(farm, dto.userId);
    this.mqttService.publishNotificationMessage(
      dto.farmId,
      dto.userId,
      dto.nick,
      Notification.ADDED_FARM,
    );
  }

  async removeFarmUser(
    dto: ExtUpdateFarmUserDto & { nick: string },
  ): Promise<void> {
    const farm = await this.checkFarmOwner(dto.farmId, dto.myId, dto.hasRole);
    if (dto.userId === dto.myId) {
      throw new AppException(FarmError.OWNER);
    }
    if (!farm.users.map((user) => user.id).includes(dto.userId)) {
      throw new AppException(FarmError.NOT_IN_FARM);
    }
    await this.removeUser(farm, dto.userId);
    this.mqttService.publishNotificationMessage(
      dto.farmId,
      dto.userId,
      dto.nick,
      Notification.REMOVED_FARM,
    );
  }

  async checkFarmExists(id: number): Promise<void> {
    await this.farmsRepository.findOneByOrFail({ id });
  }

  async checkFarmOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<Farm> {
    const farm = await this.farmsRepository.findOne({
      relations: ['users'],
      where: { id },
    });
    if (farm.userId !== userId && !hasRole) {
      throw new AppException(FarmError.NOT_OWNER);
    }
    return farm;
  }

  private async checkNameNotUsed(name: string, id?: number): Promise<void> {
    const farm = await this.farmsRepository.findOneBy({ name });
    if (farm && (!id || farm.id !== id)) {
      throw new AppException(FarmError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(
    x: number,
    y: number,
    id?: number,
  ): Promise<void> {
    const farm = await this.farmsRepository.findOneBy({ x, y });
    if (farm && (!id || farm.id !== id)) {
      throw new AppException(FarmError.COORDINATES_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateFarmDto): Promise<Farm> {
    try {
      const farm = this.farmsRepository.create({
        userId: dto.userId,
        name: dto.name,
        description: dto.description,
        x: dto.x,
        y: dto.y,
        users: [{ id: dto.userId }],
      });
      await this.farmsRepository.save(farm);
      return farm;
    } catch (error) {
      throw new AppException(FarmError.CREATE_FAILED);
    }
  }

  private async edit(farm: Farm, dto: ExtEditFarmDto): Promise<void> {
    try {
      farm.name = dto.name;
      farm.description = dto.description;
      farm.x = dto.x;
      farm.y = dto.y;
      await this.farmsRepository.save(farm);
    } catch (error) {
      throw new AppException(FarmError.EDIT_FAILED);
    }
  }

  private async addUser(farm: Farm, userId: number): Promise<void> {
    try {
      const user = new User();
      user.id = userId;
      farm.users.push(user);
      await this.farmsRepository.save(farm);
    } catch (error) {
      throw new AppException(FarmError.ADD_USER_FAILED);
    }
  }

  private async removeUser(farm: Farm, userId: number): Promise<void> {
    try {
      farm.users = farm.users.filter((user) => user.id !== userId);
      await this.farmsRepository.save(farm);
    } catch (error) {
      throw new AppException(FarmError.REMOVE_USER_FAILED);
    }
  }

  private selectFarmsQueryBuilder(): SelectQueryBuilder<Farm> {
    return this.farmsRepository
      .createQueryBuilder('farm')
      .orderBy('farm.name', 'ASC')
      .select(['farm.id', 'farm.name', 'farm.x', 'farm.y']);
  }

  private getFarmsQueryBuilder(req: Request): SelectQueryBuilder<Farm> {
    return this.farmsRepository
      .createQueryBuilder('farm')
      .innerJoin('farm.user', 'ownerUser')
      .loadRelationCountAndMap('farm.users', 'farm.users')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('farm.id = :id', { id: req.id }),
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
            .where(`${!req.farm}`)
            .orWhere('farm.id = :farmId', { farmId: req.farm }),
        ),
      )
      .orderBy('farm.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'farm.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'farm.name',
        'farm.description',
        'farm.x',
        'farm.y',
        'farm.createdAt',
      ]);
  }
}
