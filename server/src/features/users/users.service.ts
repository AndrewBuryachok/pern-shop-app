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

  getMainUsers(): Promise<User[]> {
    return this.getUsersQueryBuilder().getMany();
  }

  getMyUsers(myId: number): Promise<User[]> {
    return this.getUsersQueryBuilder()
      .where('city.userId = :myId', { myId })
      .getMany();
  }

  getAllUsers(): Promise<User[]> {
    return this.getUsersQueryBuilder().getMany();
  }

  selectAllUsers(): Promise<User[]> {
    return this.selectUsersQueryBuilder().getMany();
  }

  selectFreeUsers(): Promise<User[]> {
    return this.selectUsersQueryBuilder().where('user.city IS NULL').getMany();
  }

  async getSingleUser(userId: number): Promise<User> {
    const user = await this.getUserQueryBuilder()
      .where('user.id = :userId', { userId })
      .getOne();
    ['goods', 'wares', 'products', 'trades', 'sales'].forEach(
      (stat) => (user[stat] = user[stat].length),
    );
    return user;
  }

  async checkUserExists(id: number): Promise<void> {
    await this.usersRepository.findOneByOrFail({ id });
  }

  private selectUsersQueryBuilder(): SelectQueryBuilder<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.name', 'ASC')
      .select(['user.id', 'user.name']);
  }

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

  private getUserQueryBuilder(): SelectQueryBuilder<User> {
    return this.getUsersQueryBuilder()
      .leftJoinAndMapMany(
        'user.shops',
        'shops',
        'shop',
        'user.id = shop.userId',
      )
      .leftJoinAndMapMany(
        'user.goods',
        'goods',
        'good',
        'shop.id = good.shopId',
      )
      .leftJoinAndMapMany(
        'user.rents',
        'rents',
        'rent',
        'card.id = rent.cardId',
      )
      .leftJoinAndMapMany(
        'user.wares',
        'wares',
        'ware',
        'rent.id = ware.rentId',
      )
      .leftJoinAndMapMany(
        'user.products',
        'products',
        'product',
        'card.id = product.cardId',
      )
      .leftJoinAndMapMany(
        'user.trades',
        'trades',
        'trade',
        'card.id = trade.cardId',
      )
      .leftJoinAndMapMany(
        'user.sales',
        'sales',
        'sale',
        'card.id = sale.cardId',
      )
      .addSelect(['good.id', 'ware.id', 'product.id', 'trade.id', 'sale.id']);
  }
}
