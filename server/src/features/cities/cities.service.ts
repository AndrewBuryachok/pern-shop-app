import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { City } from './city.entity';
import { UsersService } from '../users/users.service';
import { ExtCreateCityDto, ExtEditCityDto } from './city.dto';
import { Request, Response } from '../../common/interfaces';
import { MAX_CITIES_NUMBER } from '../../common/constants';
import { AppException } from '../../common/exceptions';
import { CityError } from './city-error.enum';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async getMainCities(req: Request): Promise<Response<City>> {
    const [result, count] = await this.getCitiesQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadUsers(result);
    return { result, count };
  }

  async getMyCities(myId: number, req: Request): Promise<Response<City>> {
    const [result, count] = await this.getCitiesQueryBuilder(req)
      .andWhere('ownerUser.id = :myId', { myId })
      .getManyAndCount();
    await this.loadUsers(result);
    return { result, count };
  }

  async getAllCities(req: Request): Promise<Response<City>> {
    const [result, count] = await this.getCitiesQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadUsers(result);
    return { result, count };
  }

  selectAllCities(): Promise<City[]> {
    return this.selectCitiesQueryBuilder().addSelect('city.userId').getMany();
  }

  selectMyCities(myId: number): Promise<City[]> {
    return this.selectCitiesQueryBuilder()
      .where('city.userId = :myId', { myId })
      .getMany();
  }

  async createCity(dto: ExtCreateCityDto): Promise<void> {
    await this.checkHasNotEnough(dto.myId);
    await this.checkNameNotUsed(dto.name);
    await this.checkCoordinatesNotUsed(dto.x, dto.y);
    const city = await this.create(dto);
    await this.usersService.addUserCity({
      myId: dto.myId,
      userId: dto.myId,
      cityId: city.id,
    });
  }

  async editCity(dto: ExtEditCityDto): Promise<void> {
    const city = await this.checkCityOwner(dto.cityId, dto.myId);
    await this.edit(city, dto);
  }

  async checkCityExists(id: number): Promise<void> {
    await this.citiesRepository.findOneByOrFail({ id });
  }

  async checkCityOwner(id: number, userId: number): Promise<City> {
    const city = await this.citiesRepository.findOneBy({ id, userId });
    if (!city) {
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

  private async checkNameNotUsed(name: string): Promise<void> {
    const city = await this.citiesRepository.findOneBy({ name });
    if (city) {
      throw new AppException(CityError.NAME_ALREADY_USED);
    }
  }

  private async checkCoordinatesNotUsed(x: number, y: number): Promise<void> {
    const city = await this.citiesRepository.findOneBy({ x, y });
    if (city) {
      throw new AppException(CityError.COORDINATES_ALREADY_USED);
    }
  }

  private async create(dto: ExtCreateCityDto): Promise<City> {
    try {
      const city = this.citiesRepository.create({
        userId: dto.myId,
        name: dto.name,
        x: dto.x,
        y: dto.y,
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
      city.x = dto.x;
      city.y = dto.y;
      await this.citiesRepository.save(city);
    } catch (error) {
      throw new AppException(CityError.EDIT_FAILED);
    }
  }

  private selectCitiesQueryBuilder(): SelectQueryBuilder<City> {
    return this.citiesRepository
      .createQueryBuilder('city')
      .orderBy('city.name', 'ASC')
      .select(['city.id', 'city.name', 'city.x', 'city.y']);
  }

  private async loadUsers(cities: City[]): Promise<void> {
    const promises = cities.map(async (city) => {
      city['users'] = (
        await this.citiesRepository
          .createQueryBuilder('city')
          .leftJoinAndMapMany(
            'city.users',
            'users',
            'user',
            'city.id = user.cityId',
          )
          .where('city.id = :cityId', { cityId: city.id })
          .orderBy('user.id', 'ASC')
          .select(['city.id', 'user.id', 'user.name', 'user.status'])
          .getOne()
      )['users'];
    });
    await Promise.all(promises);
  }

  private getCitiesQueryBuilder(req: Request): SelectQueryBuilder<City> {
    return this.citiesRepository
      .createQueryBuilder('city')
      .innerJoin('city.user', 'ownerUser')
      .where(
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
      .andWhere('city.name ILIKE :name', { name: `%${req.name}%` })
      .orderBy('city.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'city.id',
        'ownerUser.id',
        'ownerUser.name',
        'ownerUser.status',
        'city.name',
        'city.x',
        'city.y',
      ]);
  }
}
