import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { City } from './city.entity';

@Injectable()
export class CitiesService {
  constructor(
    @InjectRepository(City)
    private citiesRepository: Repository<City>,
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

  async checkCityExists(id: number): Promise<void> {
    await this.citiesRepository.findOneByOrFail({ id });
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
