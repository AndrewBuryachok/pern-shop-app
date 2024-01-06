import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import { MqttService } from '../mqtt/mqtt.service';
import {
  CreateUserDto,
  ExtEditUserPasswordDto,
  ExtEditUserProfileDto,
  ExtUpdateUserRoleDto,
  UpdateUserFriendDto,
  UpdateUserSubscriberDto,
  UpdateUserTokenDto,
} from './user.dto';
import { Request, Response } from '../../common/interfaces';
import { hashData } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { UserError } from './user-error.enum';
import { Role } from './role.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => MqttService))
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
      .leftJoin('user.friends', 'friend')
      .andWhere('friend.id = :myId', { myId })
      .getManyAndCount();
    await this.loadFriends(result);
    return { result, count };
  }

  async getSentFriends(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(req)
      .leftJoinAndMapMany(
        'user.invitations',
        'invitations',
        'invitation',
        'user.id = invitation.receiverUserId',
      )
      .andWhere('invitation.senderUserId = :myId', { myId })
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
        'user.invitations',
        'invitations',
        'invitation',
        'user.id = invitation.senderUserId',
      )
      .andWhere('invitation.receiverUserId = :myId', { myId })
      .getManyAndCount();
    await this.loadFriends(result);
    return { result, count };
  }

  async getMySubscribers(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(req)
      .innerJoinAndMapOne(
        'subscriber',
        'user.receivedSubscribers',
        'subscriber',
        'subscriber.id = :myId',
        { myId },
      )
      .getManyAndCount();
    await this.loadFriends(result);
    return { result, count };
  }

  async getReceivedSubscribers(
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(req)
      .innerJoinAndMapOne(
        'subscriber',
        'user.sentSubscribers',
        'subscriber',
        'subscriber.id = :myId',
        { myId },
      )
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
        .innerJoinAndMapOne(
          'friend',
          'user.friends',
          'friend',
          'friend.id = :myId',
          { myId },
        )
        .getMany()
    ).map((friend) => friend.id);
    const users = await this.selectUsersQueryBuilder().getMany();
    return users.filter((user) => !friends.includes(user.id));
  }

  async selectNotSubscribedUsers(myId: number): Promise<User[]> {
    const subscribers = (
      await this.selectUsersQueryBuilder()
        .innerJoinAndMapOne(
          'subscriber',
          'user.receivedSubscribers',
          'subscriber',
          'subscriber.id = :myId',
          { myId },
        )
        .getMany()
    ).map((subscriber) => subscriber.id);
    const users = await this.selectUsersQueryBuilder().getMany();
    return users.filter((user) => !subscribers.includes(user.id));
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

  selectMySubscribers(myId: number): Promise<User[]> {
    return this.selectUsersQueryBuilder()
      .innerJoinAndMapOne(
        'subscriber',
        'user.receivedSubscribers',
        'subscriber',
        'subscriber.id = :myId',
        { myId },
      )
      .getMany();
  }

  async getSingleUser(userId: number): Promise<User> {
    const profile = await this.getUserProfile(userId);
    const stats = await this.getUserStatsAndRates(userId);
    return { ...profile, ...stats };
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    await this.checkNickNotUsed(dto.nick);
    const user = await this.create(dto);
    this.mqttService.publishNotificationMessage(0, Notification.CREATED_USER);
    return user;
  }

  async addUserToken(dto: UpdateUserTokenDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    await this.addToken(user, dto.token);
  }

  async removeUserToken(dto: UpdateUserTokenDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    await this.removeToken(user);
  }

  async addUserOnline(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    await this.addOnline(user);
  }

  async removeUserOnline(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    await this.removeOnline(user);
  }

  async editUserProfile(dto: ExtEditUserProfileDto): Promise<void> {
    if (dto.userId !== dto.myId && !dto.hasRole) {
      throw new AppException(UserError.NOT_OWNER);
    }
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    await this.editProfile(user, dto);
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

  async addUserSubscriber(dto: UpdateUserSubscriberDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      relations: ['sentSubscribers'],
      where: { id: dto.senderUserId },
    });
    if (
      user.sentSubscribers.find(
        (subscriber) => subscriber.id === dto.receiverUserId,
      )
    ) {
      throw new AppException(UserError.ALREADY_HAS_SUBSCRIBER);
    }
    await this.addSubscriber(user, dto.receiverUserId);
  }

  async removeUserSubscriber(dto: UpdateUserSubscriberDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      relations: ['sentSubscribers'],
      where: { id: dto.senderUserId },
    });
    if (
      !user.sentSubscribers.find(
        (subscriber) => subscriber.id === dto.receiverUserId,
      )
    ) {
      throw new AppException(UserError.NOT_HAS_SUBSCRIBER);
    }
    await this.removeSubscriber(user, dto.receiverUserId);
  }

  async checkUserExists(id: number): Promise<void> {
    await this.usersRepository.findOneByOrFail({ id });
  }

  async checkNotFriends(
    senderUserId: number,
    receiverUserId: number,
  ): Promise<User> {
    const user = await this.usersRepository.findOne({
      relations: ['friends'],
      where: { id: senderUserId, friends: [{ id: receiverUserId }] },
    });
    if (user) {
      throw new AppException(UserError.ALREADY_HAS_FRIEND);
    }
    return user;
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
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.ADD_TOKEN_FAILED);
    }
  }

  private async removeToken(user: User): Promise<void> {
    try {
      user.token = null;
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.REMOVE_TOKEN_FAILED);
    }
  }

  private async addOnline(user: User): Promise<void> {
    try {
      user.onlineAt = null;
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.ADD_ONLINE_FAILED);
    }
  }

  private async removeOnline(user: User): Promise<void> {
    try {
      user.onlineAt = new Date();
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.REMOVE_ONLINE_FAILED);
    }
  }

  private async editProfile(
    user: User,
    dto: ExtEditUserProfileDto,
  ): Promise<void> {
    try {
      user.discord = dto.discord;
      user.avatar = dto.avatar;
      user.background = dto.background;
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.EDIT_PROFILE_FAILED);
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

  private async addSubscriber(user: User, userId: number): Promise<void> {
    try {
      const subscriber = new User();
      subscriber.id = userId;
      user.sentSubscribers.push(subscriber);
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.ADD_SUBSCRIBER_FAILED);
    }
  }

  private async removeSubscriber(user: User, userId: number): Promise<void> {
    try {
      user.sentSubscribers = user.sentSubscribers.filter(
        (user) => user.id !== userId,
      );
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.REMOVE_SUBSCRIBER_FAILED);
    }
  }

  private selectUsersQueryBuilder(): SelectQueryBuilder<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.nick', 'ASC')
      .select(['user.id', 'user.nick', 'user.avatar']);
  }

  private async loadFriends(users: User[]): Promise<void> {
    const promises = users.map(async (user) => {
      user.friends = (
        await this.usersRepository
          .createQueryBuilder('user')
          .leftJoin('user.friends', 'friend')
          .where('user.id = :userId', { userId: user.id })
          .orderBy('friend.onlineAt', 'DESC')
          .addOrderBy('friend.nick', 'ASC')
          .select(['user.id', 'friend.id', 'friend.nick', 'friend.avatar'])
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
          qb.where(`${req.type !== 1}`).orWhere('user.onlineAt IS NULL'),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb.where(`${req.type !== -1}`).orWhere('user.onlineAt IS NOT NULL'),
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
      .orderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'user.id',
        'user.nick',
        'user.avatar',
        'user.roles',
        'user.createdAt',
        'user.onlineAt',
        'city.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'city.name',
        'city.x',
        'city.y',
      ]);
  }

  private async getUserProfile(userId: number): Promise<User> {
    const user = await this.getUsersQueryBuilder({ id: userId })
      .addSelect(['user.discord', 'user.background'])
      .getOne();
    await this.loadFriends([user]);
    return user;
  }

  private async getUserStatsAndRates(userId: number): Promise<User> {
    const waresCount = await this.usersRepository
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
      .select('COUNT(ware.id)', 'waresCount')
      .getRawOne();
    const productsCount = await this.usersRepository
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
      .select('COUNT(product.id)', 'productsCount')
      .getRawOne();
    const ordersCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.orders',
        'orders',
        'order',
        'card.id = order.executorCardId',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(order.id)', 'ordersCount')
      .getRawOne();
    const deliveriesCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.deliveries',
        'deliveries',
        'delivery',
        'card.id = delivery.executorCardId',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(delivery.id)', 'deliveriesCount')
      .getRawOne();
    const waresRate = await this.usersRepository
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
      .select('AVG(trade.rate)', 'waresRate')
      .getRawOne();
    const productsRate = await this.usersRepository
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
      .select('AVG(sale.rate)', 'productsRate')
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
    const rating = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.ratings', 'rating')
      .where('user.id = :userId', { userId })
      .select('AVG(rating.rate)', 'rating')
      .getRawOne();
    const user = {
      ...waresCount,
      ...productsCount,
      ...ordersCount,
      ...deliveriesCount,
      ...waresRate,
      ...productsRate,
      ...ordersRate,
      ...deliveriesRate,
      ...rating,
    };
    Object.keys(user).forEach((key) => (user[key] = +user[key]));
    return user;
  }
}
