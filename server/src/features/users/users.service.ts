import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private getUsersQueryBuilder(): SelectQueryBuilder<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.city', 'city')
      .leftJoinAndMapMany(
        'user.cards',
        'cards',
        'card',
        'user.id = card.userId',
      )
      .orderBy('user.id', 'DESC')
      .addOrderBy('card.id', 'ASC')
      .select([
        'user.id',
        'user.name',
        'user.roles',
        'city.id',
        'city.name',
        'city.x',
        'city.y',
        'card.id',
        'card.name',
        'card.color',
      ]);
  }
}
