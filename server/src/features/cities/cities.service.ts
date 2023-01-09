import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { City } from './city.entity';
import { UsersService } from '../users/users.service';
import { ExtCreateCityDto, ExtEditCityDto } from './city.dto';
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

  getMainCities(): Promise<City[]> {
    return this.getCitiesQueryBuilder().getMany();
  }

  getMyCities(myId: number): Promise<City[]> {
    return this.getCitiesQueryBuilder()
      .where('ownerUser.id = :myId', { myId })
      .getMany();
  }

  getAllCities(): Promise<City[]> {
    return this.getCitiesQueryBuilder().getMany();
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

  private getCitiesQueryBuilder(): SelectQueryBuilder<City> {
    return this.citiesRepository
      .createQueryBuilder('city')
      .innerJoin('city.user', 'ownerUser')
      .leftJoinAndMapMany(
        'city.users',
        'users',
        'user',
        'city.id = user.cityId',
      )
      .orderBy('city.id', 'DESC')
      .addOrderBy('user.id', 'ASC')
      .select([
        'city.id',
        'ownerUser.id',
        'ownerUser.name',
        'city.name',
        'city.x',
        'city.y',
        'user.id',
        'user.name',
      ]);
  }
}
