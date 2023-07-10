import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import {
  CreateUserDto,
  ExtUpdateUserRoleDto,
  UpdateUserTokenDto,
} from './user.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { UserError } from './user-error.enum';
import { Role } from './role.enum';
import { Mode } from '../../common/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getMainUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadCards(result);
    return { result, count };
  }

  async getMyUsers(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(req)
      .leftJoin('city.users', 'cityUsers')
      .andWhere('cityUsers.id = :myId', { myId })
      .getManyAndCount();
    await this.loadCards(result);
    return { result, count };
  }

  async getAllUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadCards(result);
    return { result, count };
  }

  selectAllUsers(): Promise<User[]> {
    return this.selectUsersQueryBuilder().addSelect('user.cityId').getMany();
  }

  selectNotCitizensUsers(): Promise<User[]> {
    return this.selectUsersQueryBuilder().where('user.city IS NULL').getMany();
  }

  async selectNotFriendsUsers(myId: number): Promise<User[]> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.friends',
        'friends',
        'friend',
        'user.id = friend.senderUserId OR user.id = friend.receiverUserId',
      )
      .where('user.id = :myId', { myId })
      .select([
        'user.id',
        'friend.senderUserId',
        'friend.receiverUserId',
        'friend.type',
      ])
      .getOne();
    const friends = user['friends']
      .filter((friend) => friend.senderUserId === myId || friend.type)
      .map((friend) =>
        friend.senderUserId === myId
          ? friend.receiverUserId
          : friend.senderUserId,
      );
    const users = await this.selectUsersQueryBuilder().getMany();
    return users.filter((user) => !friends.includes(user.id));
  }

  async getSingleUser(userId: number): Promise<User> {
    const profile = await this.getUserProfile(userId);
    const stats = await this.getUserStatsAndRates(userId);
    return { ...profile, ...stats };
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    await this.checkNameNotUsed(dto.name);
    return this.create(dto);
  }

  async addUserToken(dto: UpdateUserTokenDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    await this.addToken(user, dto.token);
  }

  async removeUserToken(dto: UpdateUserTokenDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    await this.removeToken(user);
  }

  async updateUserPassword(user: User, password: string): Promise<void> {
    await this.updatePassword(user, password);
  }

  async addUserRole(dto: ExtUpdateUserRoleDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (user.roles.includes(dto.role)) {
      throw new AppException(UserError.ALREADY_HAS_ROLE);
    }
    await this.addRole(user, dto.role);
  }

  async removeUserRole(dto: ExtUpdateUserRoleDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (!user.roles.includes(dto.role)) {
      throw new AppException(UserError.NOT_HAS_ROLE);
    }
    await this.removeRole(user, dto.role);
  }

  async checkUserExists(id: number): Promise<void> {
    await this.usersRepository.findOneByOrFail({ id });
  }

  findUserById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findUserByName(name: string): Promise<User> {
    return this.usersRepository.findOneBy({ name });
  }

  private async checkNameNotUsed(name: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ name });
    if (user) {
      throw new AppException(UserError.NAME_ALREADY_USED);
    }
  }

  private async create(dto: CreateUserDto): Promise<User> {
    try {
      const user = this.usersRepository.create({
        name: dto.name,
        password: dto.password,
      });
      await this.usersRepository.save(user);
      return user;
    } catch (error) {
      throw new AppException(UserError.CREATE_FAILED);
    }
  }

  private async addToken(user: User, token: string): Promise<void> {
    try {
      user.token = token;
      user.status = true;
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.ADD_TOKEN_FAILED);
    }
  }

  private async removeToken(user: User): Promise<void> {
    try {
      user.token = null;
      user.status = false;
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.REMOVE_TOKEN_FAILED);
    }
  }

  private async updatePassword(user: User, password: string): Promise<void> {
    try {
      user.password = password;
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.UPDATE_PASSWORD_FAILED);
    }
  }

  private async addRole(user: User, role: Role): Promise<void> {
    try {
      user.roles = user.roles.concat(role).sort();
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.ADD_ROLE_FAILED);
    }
  }

  private async removeRole(user: User, role: Role): Promise<void> {
    try {
      user.roles = user.roles.filter((value) => value !== role);
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.REMOVE_ROLE_FAILED);
    }
  }

  private selectUsersQueryBuilder(): SelectQueryBuilder<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.status', 'DESC')
      .addOrderBy('user.name', 'ASC')
      .select(['user.id', 'user.name', 'user.status']);
  }

  private async loadCards(users: User[]): Promise<void> {
    const promises = users.map(async (user) => {
      user.cards = (
        await this.usersRepository
          .createQueryBuilder('user')
          .leftJoin('user.cards', 'card')
          .where('user.id = :userId', { userId: user.id })
          .orderBy('card.name', 'ASC')
          .select(['user.id', 'card.id', 'card.name', 'card.color'])
          .getOne()
      ).cards;
    });
    await Promise.all(promises);
  }

  private getUsersQueryBuilder(req: Request): SelectQueryBuilder<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.city', 'city')
      .leftJoin('city.user', 'ownerUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(`user.id = :userId`, { userId: req.user }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.roles}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.SOME}`)
                  .andWhere('user.roles && :roles'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.EACH}`)
                  .andWhere('user.roles @> :roles'),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere('user.roles = :roles'),
              ),
            ),
        ),
        { roles: req.roles },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.city}`)
            .orWhere('city.id = :cityId', { cityId: req.city }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.type}`)
            .orWhere('user.status = :type', { type: req.type === 1 }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.name}`)
            .orWhere('user.name ILIKE :name', { name: req.name }),
        ),
      )
      .orderBy('user.status', 'DESC')
      .addOrderBy('user.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'user.id',
        'user.name',
        'user.status',
        'user.roles',
        'city.id',
        'ownerUser.id',
        'ownerUser.name',
        'ownerUser.status',
        'city.name',
        'city.x',
        'city.y',
      ]);
  }

  private async getUserProfile(userId: number): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.city', 'city')
      .leftJoinAndMapMany(
        'user.friends',
        'friends',
        'friend',
        'user.id = friend.senderUserId OR user.id = friend.receiverUserId',
      )
      .where('user.id = :userId', { userId })
      .select([
        'user.id',
        'user.name',
        'user.status',
        'user.roles',
        'city.id',
        'city.name',
        'city.x',
        'city.y',
        'friend.senderUserId',
        'friend.receiverUserId',
        'friend.type',
      ])
      .getOne();
    await this.loadCards([user]);
    const friends = user['friends']
      .filter((friend) => friend.type)
      .map((friend) =>
        friend.senderUserId === userId
          ? friend.receiverUserId
          : friend.senderUserId,
      );
    const users = await this.selectUsersQueryBuilder().getMany();
    user['friends'] = users.filter((user) => friends.includes(user.id));
    return user;
  }

  private async getUserStatsAndRates(userId: number): Promise<User> {
    const goods = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.shops', 'shop')
      .leftJoin('shop.goods', 'good')
      .where('user.id = :userId', { userId })
      .select('COUNT(good.id)', 'goods')
      .getRawOne();
    const wares = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.rents',
        'rents',
        'rent',
        'card.id = rent.cardId',
      )
      .leftJoinAndMapMany(
        'rent.wares',
        'wares',
        'ware',
        'rent.id = ware.rentId',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(ware.id)', 'wares')
      .getRawOne();
    const products = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.leases',
        'leases',
        'lease',
        'card.id = lease.cardId',
      )
      .leftJoinAndMapMany(
        'lease.products',
        'products',
        'product',
        'lease.id = product.leaseId',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(product.id)', 'products')
      .getRawOne();
    const orders = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.orders',
        'orders',
        'order',
        'card.id = order.executorCardId',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(order.id)', 'orders')
      .getRawOne();
    const deliveries = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.deliveries',
        'deliveries',
        'delivery',
        'card.id = delivery.executorCardId',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(delivery.id)', 'deliveries')
      .getRawOne();
    const tradesRate = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.rents',
        'rents',
        'rent',
        'card.id = rent.cardId',
      )
      .leftJoinAndMapMany(
        'rent.wares',
        'wares',
        'ware',
        'rent.id = ware.rentId',
      )
      .leftJoinAndMapMany(
        'ware.trades',
        'trades',
        'trade',
        'ware.id = trade.wareId',
      )
      .where('user.id = :userId', { userId })
      .select('AVG(trade.rate)', 'tradesRate')
      .getRawOne();
    const salesRate = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.leases',
        'leases',
        'lease',
        'card.id = lease.cardId',
      )
      .leftJoinAndMapMany(
        'lease.products',
        'products',
        'product',
        'lease.id = product.leaseId',
      )
      .leftJoinAndMapMany(
        'product.sales',
        'sales',
        'sale',
        'product.id = sale.productId',
      )
      .where('user.id = :userId', { userId })
      .select('AVG(sale.rate)', 'salesRate')
      .getRawOne();
    const ordersRate = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.orders',
        'orders',
        'order',
        'card.id = order.executorCardId',
      )
      .where('user.id = :userId', { userId })
      .select('AVG(order.rate)', 'ordersRate')
      .getRawOne();
    const deliveriesRate = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.deliveries',
        'deliveries',
        'delivery',
        'card.id = delivery.executorCardId',
      )
      .where('user.id = :userId', { userId })
      .select('AVG(delivery.rate)', 'deliveriesRate')
      .getRawOne();
    const ratings = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.ratings', 'rating')
      .where('user.id = :userId', { userId })
      .select('AVG(rating.rate)', 'rating')
      .getRawOne();
    const user = {
      ...goods,
      ...wares,
      ...products,
      ...orders,
      ...deliveries,
      ...tradesRate,
      ...salesRate,
      ...ordersRate,
      ...deliveriesRate,
      ...ratings,
    };
    Object.keys(user).forEach((key) => (user[key] = +user[key]));
    return user;
  }
}
