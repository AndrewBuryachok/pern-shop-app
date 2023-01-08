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
