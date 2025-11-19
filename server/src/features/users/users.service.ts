import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import { MqttService } from '../mqtt/mqtt.service';
import { TwitchService } from '../twitch/twitch.service';
import {
  CreateUserDto,
  ExtEditUserPasswordDto,
  ExtEditUserProfileDto,
  ExtUpdateUserRoleDto,
  UpdateUserFriendDto,
  UpdateUserTokenDto,
  UpdateUserTownDto,
} from './user.dto';
import { Request, Response } from '../../common/interfaces';
import { hashData } from '../../common/utils';
import { AppException } from '../../common/exceptions';
import { UserError } from './user-error.enum';
import { Role } from './role.enum';
import { Event } from '../../common/enums';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => MqttService))
    private mqttService: MqttService,
    @Inject(forwardRef(() => TwitchService))
    private twitchService: TwitchService,
  ) {}

  async getMainUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getExtUsersQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getFriendsUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getFriendsQueryBuilder(req)
      .leftJoin('user.friends', 'friend')
      .groupBy('user.id')
      .addGroupBy('town.id')
      .addGroupBy('ownerUser.id')
      .orderBy('user_friends', 'DESC', 'NULLS LAST')
      .addOrderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.id', 'DESC')
      .addSelect('COUNT(friend.id)', 'user_friends')
      .getManyAndCount();
    return { result, count };
  }

  async getMyUsers(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.getExtUsersQueryBuilder(req)
      .leftJoin('town.users', 'townUsers')
      .andWhere('townUsers.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getAllUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getExtUsersQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  getFriendsQueryBuilder(req: Request): SelectQueryBuilder<User> {
    return this.getUsersQueryBuilder(req).loadRelationCountAndMap(
      'user.friendsCount',
      'user.friends',
    );
  }

  getResidentsQueryBuilder(req: Request): SelectQueryBuilder<User> {
    return this.getExtUsersQueryBuilder(req);
  }

  selectAllUsers(): Promise<User[]> {
    return this.selectUsersQueryBuilder().getMany();
  }

  selectNotCitizensUsers(): Promise<User[]> {
    return this.selectUsersQueryBuilder()
      .where('user.townId IS NULL')
      .getMany();
  }

  async selectNotFriendsUsers(myId: number): Promise<User[]> {
    const friends = (
      await this.usersRepository.findOne({
        relations: ['friends'],
        where: { id: myId },
      })
    ).friends.map((friend) => friend.id);
    const offers = (
      await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndMapMany(
          'user.offers',
          'offers',
          'offer',
          'offer.senderUserId = user.id',
        )
        .where('user.id = :myId', { myId })
        .select(['user.id', 'offer.receiverUserId'])
        .getOne()
    )['offers'].map((offer) => offer.receiverUserId);
    const users = await this.selectUsersQueryBuilder().getMany();
    return users.filter(
      (user) => !friends.includes(user.id) && !offers.includes(user.id),
    );
  }

  async getSingleUser(nick: string): Promise<User> {
    const profile = await this.getUserProfile(nick);
    const stats = await this.getUserStatsAndRates(profile.id);
    return { ...profile, ...stats };
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    await this.checkNickNotUsed(dto.nick);
    const user = await this.create(dto);
    const body = await this.selectUsersQueryBuilder()
      .where('user.id = :id', { id: user.id })
      .getOne();
    this.mqttService.publishEvent(
      0,
      Event.USERS,
      user.id,
      JSON.stringify(body),
    );
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
    if (!user.type) {
      await this.addOnline(user);
    }
  }

  async removeUserOnline(id: number): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user.type) {
      await this.removeOnline(user);
    }
  }

  async editUserProfile(dto: ExtEditUserProfileDto): Promise<void> {
    if (dto.userId !== dto.myId && !dto.hasRole) {
      throw new AppException(UserError.NOT_OWNER);
    }
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (user.nick !== dto.nick) {
      await this.checkNickNotUsed(dto.nick);
    }
    if (
      user.roles.includes(Role.STREAMER) &&
      user.twitch &&
      user.twitch !== dto.twitch
    ) {
      await this.twitchService.unfollow(user.twitch);
    }
    if (
      user.roles.includes(Role.STREAMER) &&
      dto.twitch &&
      dto.twitch !== user.twitch
    ) {
      await this.twitchService.follow(dto.twitch);
    }
    await this.editProfile(user, dto);
    const body = await this.selectUsersQueryBuilder()
      .where('user.id = :id', { id: user.id })
      .getOne();
    this.mqttService.publishEvent(
      0,
      Event.USERS,
      user.id,
      JSON.stringify(body),
    );
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
    if (dto.role === Role.STREAMER && user.twitch) {
      await this.twitchService.follow(user.twitch);
    }
    await this.addRole(user, dto.role);
  }

  async removeUserRole(dto: ExtUpdateUserRoleDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (!user.roles.includes(dto.role)) {
      throw new AppException(UserError.NOT_HAS_ROLE);
    }
    if (dto.role === Role.STREAMER && user.twitch) {
      await this.twitchService.unfollow(user.twitch);
    }
    await this.removeRole(user, dto.role);
  }

  async addUserTown(dto: UpdateUserTownDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (user.townId) {
      throw new AppException(UserError.ALREADY_IN_TOWN);
    }
    await this.addTown(user, dto.townId);
  }

  async removeUserTown(dto: UpdateUserTownDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (user.townId !== dto.townId) {
      throw new AppException(UserError.NOT_IN_TOWN);
    }
    await this.removeTown(user);
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

  findUserByTwitch(twitch: string): Promise<User> {
    return this.usersRepository.findOneBy({ twitch });
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
      user.type = true;
      user.onlineAt = new Date();
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.ADD_ONLINE_FAILED);
    }
  }

  private async removeOnline(user: User): Promise<void> {
    try {
      const diff = (new Date().getTime() - user.onlineAt.getTime()) / 60000;
      user.time += Math.floor(diff);
      user.type = false;
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
      user.nick = dto.nick;
      user.avatar = dto.avatar;
      user.background = dto.background;
      user.discord = dto.discord;
      user.twitch = dto.twitch;
      user.youtube = dto.youtube;
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

  private async addTown(user: User, townId: number): Promise<void> {
    try {
      user.townId = townId;
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.ADD_TOWN_FAILED);
    }
  }

  private async removeTown(user: User): Promise<void> {
    try {
      user.townId = null;
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.REMOVE_TOWN_FAILED);
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

  private selectUsersQueryBuilder(): SelectQueryBuilder<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.nick', 'ASC')
      .select(['user.id', 'user.nick', 'user.avatar']);
  }

  private getExtUsersQueryBuilder(req: Request): SelectQueryBuilder<User> {
    return this.getUsersQueryBuilder(req).addSelect(['user.time']);
  }

  private getUsersQueryBuilder(req: Request): SelectQueryBuilder<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.town', 'town')
      .leftJoin('town.user', 'ownerUser')
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
            .where(`${!req.town}`)
            .orWhere('town.id = :townId', { townId: req.town }),
        ),
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.type}`)
            .orWhere('user.type = :type', { type: req.type === 1 }),
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
      .orderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
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
        'user.type',
        'town.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'town.name',
        'town.x',
        'town.y',
      ]);
  }

  private async getUserProfile(nick: string): Promise<User> {
    const user = await this.getUsersQueryBuilder({})
      .where('user.nick = :nick', { nick })
      .addSelect([
        'user.time',
        'user.background',
        'user.discord',
        'user.twitch',
        'user.youtube',
      ])
      .getOne();
    if (!user) {
      throw new AppException(UserError.UNKNOWN);
    }
    user.friends = await this.selectUsersQueryBuilder()
      .innerJoinAndMapOne(
        'friend',
        'user.friends',
        'friend',
        'friend.id = :userId',
        { userId: user.id },
      )
      .getMany();
    return user;
  }

  private async getUserStatsAndRates(userId: number): Promise<User> {
    const goodsCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.goods',
        'goods',
        'good',
        'card.id = good.cardId',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(good.id)', 'goodsCount')
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
    const haulagesCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.haulages',
        'haulages',
        'haulage',
        'card.id = haulage.executorCardId',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(haulage.id)', 'haulagesCount')
      .getRawOne();
    const goodsRate = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.goods',
        'goods',
        'good',
        'card.id = good.cardId',
      )
      .leftJoin('good.purchases', 'purchase')
      .where('user.id = :userId', { userId })
      .select('SUM(purchase.rate)', 'goodsRate')
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
    const haulagesRate = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.haulages',
        'haulages',
        'haulage',
        'card.id = haulage.executorCardId',
      )
      .where('user.id = :userId', { userId })
      .select('AVG(haulage.rate)', 'haulagesRate')
      .getRawOne();
    const user = {
      ...goodsCount,
      ...deliveriesCount,
      ...ordersCount,
      ...haulagesCount,
      ...goodsRate,
      ...deliveriesRate,
      ...ordersRate,
      ...haulagesRate,
    };
    Object.keys(user).forEach((key) => (user[key] = +user[key]));
    return user;
  }
}
