import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  CreateUserDto,
  ExtEditUserPasswordDto,
  ExtUpdateUserRoleDto,
  UpdateUserFollowingDto,
  UpdateUserFriendDto,
  UpdateUserTokenDto,
} from './user.dto';
import { Request, Response } from '../../common/interfaces';
import { hashData } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { UserError } from './user-error.enum';
import { Role } from './role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private mqttService: MqttService,
  ) {}

  async getMainUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadFriends(result);
    return { result, count };
  }

  async getMyUsers(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(req)
      .leftJoin('city.users', 'cityUsers')
      .andWhere('cityUsers.id = :myId', { myId })
      .getManyAndCount();
    await this.loadFriends(result);
    return { result, count };
  }

  async getAllUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadFriends(result);
    return { result, count };
  }

  async getMyFriends(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(req)
      .leftJoinAndMapMany(
        'user.friends',
        'friends',
        'friend',
        'user.id = friend.receiver_user_id',
      )
      .andWhere('friend.sender_user_id = :myId', { myId })
      .getManyAndCount();
    await this.loadFriends(result);
    return { result, count };
  }

  async getReceivedFriends(
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(req)
      .leftJoinAndMapMany(
        'user.friends',
        'friends',
        'friend',
        'user.id = friend.sender_user_id',
      )
      .andWhere('friend.receiver_user_id = :myId', { myId })
      .getManyAndCount();
    await this.loadFriends(result);
    return { result, count };
  }

  async getMyFollowings(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(req)
      .leftJoinAndMapMany(
        'user.followings',
        'followings',
        'following',
        'user.id = following.receiver_user_id',
      )
      .andWhere('following.sender_user_id = :myId', { myId })
      .getManyAndCount();
    await this.loadFriends(result);
    return { result, count };
  }

  async getReceivedFollowings(
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(req)
      .leftJoinAndMapMany(
        'user.followings',
        'followings',
        'following',
        'user.id = following.sender_user_id',
      )
      .andWhere('following.receiver_user_id = :myId', { myId })
      .getManyAndCount();
    await this.loadFriends(result);
    return { result, count };
  }

  selectAllUsers(): Promise<User[]> {
    return this.selectUsersQueryBuilder().getMany();
  }

  selectNotCitizensUsers(): Promise<User[]> {
    return this.selectUsersQueryBuilder()
      .where('user.cityId IS NULL')
      .getMany();
  }

  async selectNotFriendsUsers(myId: number): Promise<User[]> {
    const friends = (
      await this.selectUsersQueryBuilder()
        .leftJoinAndMapMany(
          'user.friends',
          'friends',
          'friend',
          'user.id = friend.receiver_user_id',
        )
        .where('friend.sender_user_id = :myId', { myId })
        .getMany()
    ).map((friend) => friend.id);
    const users = await this.selectUsersQueryBuilder().getMany();
    return users.filter((user) => !friends.includes(user.id));
  }

  async selectNotFollowingsUsers(myId: number): Promise<User[]> {
    const followings = (
      await this.selectUsersQueryBuilder()
        .leftJoinAndMapMany(
          'user.followings',
          'followings',
          'following',
          'user.id = following.receiver_user_id',
        )
        .where('following.sender_user_id = :myId', { myId })
        .getMany()
    ).map((following) => following.id);
    const users = await this.selectUsersQueryBuilder().getMany();
    return users.filter((user) => !followings.includes(user.id));
  }

  async selectNotRatedUsers(myId: number): Promise<User[]> {
    const ratings = (
      await this.selectUsersQueryBuilder()
        .innerJoin('user.ratings', 'rating')
        .where('rating.senderUserId = :myId', { myId })
        .getMany()
    ).map((user) => user.id);
    const users = await this.selectUsersQueryBuilder().getMany();
    return users.filter((user) => !ratings.includes(user.id));
  }

  async getSingleUser(userId: number): Promise<User> {
    const profile = await this.getUserProfile(userId);
    const stats = await this.getUserStatsAndRates(userId);
    return { ...profile, ...stats };
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    await this.checkNickNotUsed(dto.nick);
    return this.create(dto);
  }

  async addUserToken(dto: UpdateUserTokenDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    await this.addToken(user, dto.token);
    this.mqttService.publishUserMessage(dto.userId, 'online');
  }

  async removeUserToken(dto: UpdateUserTokenDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    await this.removeToken(user);
    this.mqttService.publishUserMessage(dto.userId, '');
  }

  async updateUserPassword(user: User, password: string): Promise<void> {
    await this.updatePassword(user, password);
  }

  async editUserPassword(dto: ExtEditUserPasswordDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    const hash = await hashData(dto.password);
    await this.updatePassword(user, hash);
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

  async addUserFriend(dto: UpdateUserFriendDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      relations: ['friends'],
      where: { id: dto.senderUserId },
    });
    if (user.friends.find((friend) => friend.id === dto.receiverUserId)) {
      throw new AppException(UserError.ALREADY_HAS_FRIEND);
    }
    await this.addFriend(user, dto.receiverUserId);
  }

  async removeUserFriend(dto: UpdateUserFriendDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      relations: ['friends'],
      where: { id: dto.senderUserId },
    });
    if (!user.friends.find((friend) => friend.id === dto.receiverUserId)) {
      throw new AppException(UserError.NOT_HAS_FRIEND);
    }
    await this.removeFriend(user, dto.receiverUserId);
  }

  async addUserFollowing(dto: UpdateUserFollowingDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      relations: ['followings'],
      where: { id: dto.senderUserId },
    });
    if (user.followings.find((friend) => friend.id === dto.receiverUserId)) {
      throw new AppException(UserError.ALREADY_HAS_FRIEND);
    }
    await this.addFollowing(user, dto.receiverUserId);
  }

  async removeUserFollowing(dto: UpdateUserFollowingDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      relations: ['followings'],
      where: { id: dto.senderUserId },
    });
    if (!user.followings.find((friend) => friend.id === dto.receiverUserId)) {
      throw new AppException(UserError.NOT_HAS_FRIEND);
    }
    await this.removeFollowing(user, dto.receiverUserId);
  }

  async checkUserExists(id: number): Promise<void> {
    await this.usersRepository.findOneByOrFail({ id });
  }

  findUserById(id: number): Promise<User> {
    return this.usersRepository.findOneBy({ id });
  }

  findUserByNick(nick: string): Promise<User> {
    return this.usersRepository.findOneBy({ nick });
  }

  private async checkNickNotUsed(nick: string): Promise<void> {
    const user = await this.usersRepository.findOneBy({ nick });
    if (user) {
      throw new AppException(UserError.NICK_ALREADY_USED);
    }
  }

  private async create(dto: CreateUserDto): Promise<User> {
    try {
      const user = this.usersRepository.create({
        nick: dto.nick,
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

  private async addFriend(user: User, userId: number): Promise<void> {
    try {
      const friend = new User();
      friend.id = userId;
      user.friends.push(friend);
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.ADD_FRIEND_FAILED);
    }
  }

  private async removeFriend(user: User, userId: number): Promise<void> {
    try {
      user.friends = user.friends.filter((user) => user.id !== userId);
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.REMOVE_FRIEND_FAILED);
    }
  }

  private async addFollowing(user: User, userId: number): Promise<void> {
    try {
      const following = new User();
      following.id = userId;
      user.followings.push(following);
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.ADD_FOLLOWING_FAILED);
    }
  }

  private async removeFollowing(user: User, userId: number): Promise<void> {
    try {
      user.followings = user.followings.filter((user) => user.id !== userId);
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.REMOVE_FOLLOWING_FAILED);
    }
  }

  private selectUsersQueryBuilder(): SelectQueryBuilder<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.nick', 'ASC')
      .select(['user.id', 'user.nick']);
  }

  private async loadFriends(users: User[]): Promise<void> {
    const promises = users.map(async (user) => {
      user.friends = (
        await this.usersRepository
          .createQueryBuilder('user')
          .leftJoin('user.friends', 'friend')
          .where('user.id = :userId', { userId: user.id })
          .orderBy('friend.nick', 'ASC')
          .select(['user.id', 'friend.id', 'friend.nick'])
          .getOne()
      ).friends;
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
          qb.where(`${!req.id}`).orWhere('user.id = :id', { id: req.id }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere('user.id = :userId', { userId: req.user }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.roles}`)
            .orWhere('user.roles @> :roles', { roles: req.roles }),
        ),
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
            .where(`${!req.minDate}`)
            .orWhere('user.createdAt >= :minDate', { minDate: req.minDate }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.maxDate}`)
            .orWhere('user.createdAt <= :maxDate', { maxDate: req.maxDate }),
        ),
      )
      .orderBy('user.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'user.id',
        'user.nick',
        'user.roles',
        'user.createdAt',
        'city.id',
        'ownerUser.id',
        'ownerUser.nick',
        'city.name',
        'city.x',
        'city.y',
      ]);
  }

  private async getUserProfile(userId: number): Promise<User> {
    const user = await this.getUsersQueryBuilder({ id: userId }).getOne();
    await this.loadFriends([user]);
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
