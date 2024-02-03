import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { City } from './city.entity';
import { User } from '../users/user.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  ExtCreateCityDto,
  ExtEditCityDto,
  ExtUpdateCityUserDto,
} from './city.dto';
import { Request, Response } from '../../common/interfaces';
import { MAX_CITIES_NUMBER } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { CityError } from './city-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
    private mqttService: MqttService,
  ) {}

  async getMainCities(req: Request): Promise<Response<City>> {
    const [result, count] = await this.getCitiesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getMyCities(myId: number, req: Request): Promise<Response<City>> {
    const [result, count] = await this.getCitiesQueryBuilder(req)
      .innerJoin('city.users', 'ownerUsers')
      .andWhere('ownerUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllCities(req: Request): Promise<Response<City>> {
    const [result, count] = await this.getCitiesQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  selectAllCities(): Promise<City[]> {
    return this.selectCitiesQueryBuilder().getMany();
  }

  selectMyCities(myId: number): Promise<City[]> {
    return this.selectCitiesQueryBuilder()
      .where('city.userId = :myId', { myId })
      .getMany();
  }

  async selectCityUsers(cityId): Promise<User[]> {
    const city = await this.citiesRepository
      .createQueryBuilder('city')
      .leftJoin('city.users', 'user')
      .where('city.id = :cityId', { cityId })
      .orderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.nick', 'ASC')
      .select(['city.id', 'user.id', 'user.nick', 'user.avatar'])
      .getOne();
    return city.users;
  }

  async createCity(dto: ExtCreateCityDto & { nick: string }): Promise<void> {
    await this.checkNotCityUser(dto.userId);
    await this.checkHasNotEnough(dto.userId);
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    await this.create(dto);
    this.mqttService.publishNotificationMessage(
      0,
      dto.nick,
      Notification.CREATED_CITY,
    );
  }

  async editCity(dto: ExtEditCityDto): Promise<void> {
    const city = await this.checkCityOwner(dto.cityId, dto.myId, dto.hasRole);
    await this.checkNameNotUsed(dto.name, dto.cityId);
    await this.checkCoordinatesNotUsed(dto.x, dto.y, dto.cityId);
    await this.edit(city, dto);
  }

  async addCityUser(
    dto: ExtUpdateCityUserDto & { nick: string },
  ): Promise<void> {
    const city = await this.checkCityOwner(dto.cityId, dto.myId, dto.hasRole);
    await this.checkNotCityUser(dto.userId);
    await this.addUser(city, dto.userId);
    this.mqttService.publishNotificationMessage(
      dto.userId,
      dto.nick,
      Notification.ADDED_CITY,
    );
  }

  async removeCityUser(
    dto: ExtUpdateCityUserDto & { nick: string },
  ): Promise<void> {
    const city =
      dto.userId === dto.myId
        ? await this.findCityById(dto.cityId)
        : await this.checkCityOwner(dto.cityId, dto.myId, dto.hasRole);
    if (city.userId === dto.userId) {
      throw new AppException(CityError.OWNER);
    }
    if (!city.users.map((user) => user.id).includes(dto.userId)) {
      throw new AppException(CityError.NOT_IN_CITY);
    }
    await this.removeUser(city, dto.userId);
    if (dto.userId !== dto.myId) {
      this.mqttService.publishNotificationMessage(
        city.userId,
        dto.nick,
        Notification.LEFT_CITY,
      );
    } else {
      this.mqttService.publishNotificationMessage(
        dto.userId,
        dto.nick,
        Notification.REMOVED_CITY,
      );
    }
  }

  async checkCityExists(id: number): Promise<void> {
    await this.citiesRepository.findOneByOrFail({ id });
  }

  async checkNotCityUser(userId: number): Promise<void> {
    const city = await this.citiesRepository.findOne({
      relations: ['users'],
      where: { users: [{ id: userId }] },
    });
    if (city) {
      throw new AppException(CityError.ALREADY_IN_CITY);
    }
  }

  async checkCityOwner(
    id: number,
    userId: number,
    hasRole: boolean,
  ): Promise<City> {
    const city = await this.findCityById(id);
    if (city.userId !== userId && !hasRole) {
      throw new AppException(CityError.NOT_OWNER);
    }
    return city;
  }

  private async checkHasNotEnough(userId: number): Promise<void> {
    const count = await this.citiesRepository.countBy({ userId });
    if (count === MAX_CITIES_NUMBER) {
      throw new AppException(CityError.ALREADY_HAS_ENOUGH);
    }
  }

  private async checkNameNotUsed(name: string, id?: number): Promise<void> {
    const city = await this.citiesRepository.findOneBy({ name });
    if (city && (!id || city.id !== id)) {
      throw new AppException(CityError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(
    x: number,
    y: number,
    id?: number,
  ): Promise<void> {
    const city = await this.citiesRepository.findOneBy({ x, y });
    if (city && (!id || city.id !== id)) {
      throw new AppException(CityError.COORDINATES_ALREADY_USED);
    }
  }

  private findCityById(id: number): Promise<City> {
    return this.citiesRepository.findOne({
      relations: ['users'],
      where: { id },
    });
  }

  private async create(dto: ExtCreateCityDto): Promise<City> {
    try {
      const city = this.citiesRepository.create({
        userId: dto.userId,
        name: dto.name,
        image: dto.image,
        video: dto.video,
        description: dto.description,
        x: dto.x,
        y: dto.y,
        users: [{ id: dto.userId }],
      });
      await this.citiesRepository.save(city);
      return city;
    } catch (error) {
      throw new AppException(CityError.CREATE_FAILED);
    }
  }

  private async edit(city: City, dto: ExtEditCityDto): Promise<void> {
    try {
      city.name = dto.name;
      city.image = dto.image;
      city.video = dto.video;
      city.description = dto.description;
      city.x = dto.x;
      city.y = dto.y;
      await this.citiesRepository.save(city);
    } catch (error) {
      throw new AppException(CityError.EDIT_FAILED);
    }
  }

  private async addUser(city: City, userId: number): Promise<void> {
    try {
      const user = new User();
      user.id = userId;
      city.users.push(user);
      await this.citiesRepository.save(city);
    } catch (error) {
      throw new AppException(CityError.ADD_USER_FAILED);
    }
  }

  private async removeUser(city: City, userId: number): Promise<void> {
    try {
      city.users = city.users.filter((user) => user.id !== userId);
      await this.citiesRepository.save(city);
    } catch (error) {
      throw new AppException(CityError.REMOVE_USER_FAILED);
    }
  }

  private selectCitiesQueryBuilder(): SelectQueryBuilder<City> {
    return this.citiesRepository
      .createQueryBuilder('city')
      .orderBy('city.name', 'ASC')
      .select(['city.id', 'city.name', 'city.x', 'city.y']);
  }

  private getCitiesQueryBuilder(req: Request): SelectQueryBuilder<City> {
    return this.citiesRepository
      .createQueryBuilder('city')
      .innerJoin('city.user', 'ownerUser')
      .loadRelationCountAndMap('city.users', 'city.users')
      .where(
        new Brackets((qb) =>
          qb.where(`${!req.id}`).orWhere('city.id = :id', { id: req.id }),
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
            .where(`${!req.city}`)
            .orWhere('city.id = :cityId', { cityId: req.city }),
        ),
      )
      .orderBy('city.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'city.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'city.name',
        'city.image',
        'city.video',
        'city.description',
        'city.x',
        'city.y',
        'city.createdAt',
      ]);
  }
}
