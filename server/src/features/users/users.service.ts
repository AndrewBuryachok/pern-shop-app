import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import {
  CreateUserDto,
  ExtEditUserPasswordDto,
  ExtEditUserProfileDto,
  ExtUpdateUserRoleDto,
  UpdateUserFriendDto,
  UpdateUserIgnorerDto,
  UpdateUserSubscriberDto,
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
  ) {}

  async getMainUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getExtUsersQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async getTopUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getExtUsersQueryBuilder(req)
      .orderBy('user.time', 'DESC')
      .addOrderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.id', 'DESC')
      .getManyAndCount();
    return { result, count };
  }

  async getFriendsUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getFriendsQueryBuilder(req)
      .leftJoin('user.friends', 'friend')
      .groupBy('user.id')
      .addGroupBy('city.id')
      .addGroupBy('ownerUser.id')
      .orderBy('user_friends', 'DESC', 'NULLS LAST')
      .addOrderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.id', 'DESC')
      .addSelect('COUNT(friend.id)', 'user_friends')
      .getManyAndCount();
    return { result, count };
  }

  async getSubscribersUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getSubscribersQueryBuilder(req)
      .leftJoin('user.receivedSubscribers', 'subscriber')
      .groupBy('user.id')
      .addGroupBy('city.id')
      .addGroupBy('ownerUser.id')
      .orderBy('user_subscribers', 'DESC', 'NULLS LAST')
      .addOrderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.id', 'DESC')
      .addSelect('COUNT(subscriber.id)', 'user_subscribers')
      .getManyAndCount();
    return { result, count };
  }

  async getIgnorersUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getIgnorersQueryBuilder(req)
      .leftJoin('user.receivedIgnorers', 'ignorer')
      .groupBy('user.id')
      .addGroupBy('city.id')
      .addGroupBy('ownerUser.id')
      .orderBy('user_ignorers', 'DESC', 'NULLS LAST')
      .addOrderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.id', 'DESC')
      .addSelect('COUNT(ignorer.id)', 'user_ignorers')
      .getManyAndCount();
    return { result, count };
  }

  async getRatingsUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getRatingsQueryBuilder(req)
      .leftJoin('user.receivedRatings', 'rating')
      .groupBy('user.id')
      .addGroupBy('city.id')
      .addGroupBy('ownerUser.id')
      .orderBy('user_rating', 'DESC', 'NULLS LAST')
      .addOrderBy('user_ratings', 'DESC', 'NULLS LAST')
      .addOrderBy('user.type', 'DESC')
      .addOrderBy('user.onlineAt', 'DESC')
      .addOrderBy('user.id', 'DESC')
      .addSelect('AVG(rating.rate)', 'user_rating')
      .addSelect('COUNT(rating.id)', 'user_ratings')
      .getManyAndCount();
    return { result, count };
  }

  async getMyUsers(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.getExtUsersQueryBuilder(req)
      .leftJoin('city.users', 'cityUsers')
      .andWhere('cityUsers.id = :myId', { myId })
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

  getSubscribersQueryBuilder(req: Request): SelectQueryBuilder<User> {
    return this.getUsersQueryBuilder(req).loadRelationCountAndMap(
      'user.subscribersCount',
      'user.receivedSubscribers',
    );
  }

  getIgnorersQueryBuilder(req: Request): SelectQueryBuilder<User> {
    return this.getUsersQueryBuilder(req).loadRelationCountAndMap(
      'user.ignorersCount',
      'user.receivedIgnorers',
    );
  }

  getRatingsQueryBuilder(req: Request): SelectQueryBuilder<User> {
    return this.getUsersQueryBuilder(req).loadRelationCountAndMap(
      'user.ratersCount',
      'user.receivedRatings',
    );
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
      await this.usersRepository.findOne({
        relations: ['friends'],
        where: { id: myId },
      })
    ).friends.map((friend) => friend.id);
    const invitations = (
      await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndMapMany(
          'user.invitations',
          'invitations',
          'invitation',
          'invitation.senderUserId = user.id',
        )
        .where('user.id = :myId', { myId })
        .select(['user.id', 'invitation.receiverUserId'])
        .getOne()
    )['invitations'].map((invitation) => invitation.receiverUserId);
    const users = await this.selectUsersQueryBuilder().getMany();
    return users.filter(
      (user) => !friends.includes(user.id) && !invitations.includes(user.id),
    );
  }

  async selectNotSubscribedUsers(myId: number): Promise<User[]> {
    const subscribers = (
      await this.usersRepository.findOne({
        relations: ['sentSubscribers'],
        where: { id: myId },
      })
    ).sentSubscribers.map((subscriber) => subscriber.id);
    const users = await this.selectUsersQueryBuilder().getMany();
    return users.filter((user) => !subscribers.includes(user.id));
  }

  async selectNotIgnoredUsers(myId: number): Promise<User[]> {
    const ignorers = (
      await this.usersRepository.findOne({
        relations: ['sentIgnorers'],
        where: { id: myId },
      })
    ).sentIgnorers.map((ignorer) => ignorer.id);
    const users = await this.selectUsersQueryBuilder().getMany();
    return users.filter((user) => !ignorers.includes(user.id));
  }

  async selectNotRatedUsers(myId: number): Promise<User[]> {
    const raters = (
      await this.usersRepository.findOne({
        relations: ['sentRatings'],
        where: { id: myId },
      })
    ).sentRatings.map((rating) => rating.receiverUserId);
    raters.push(myId);
    const users = await this.selectUsersQueryBuilder().getMany();
    return users.filter((user) => !raters.includes(user.id));
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

  selectMyIgnorers(myId: number): Promise<User[]> {
    return this.selectUsersQueryBuilder()
      .innerJoinAndMapOne(
        'ignorer',
        'user.receivedIgnorers',
        'ignorer',
        'ignorer.id = :myId',
        { myId },
      )
      .getMany();
  }

  async getSingleUser(nick: string): Promise<User> {
    const profile = await this.getUserProfile(nick);
    const stats = await this.getUserStatsAndRates(profile.id);
    return { ...profile, ...stats };
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    await this.checkNickNotUsed(dto.nick);
    const user = await this.create(dto);
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

  async addUserIgnorer(dto: UpdateUserIgnorerDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      relations: ['sentIgnorers'],
      where: { id: dto.senderUserId },
    });
    if (
      user.sentIgnorers.find((ignorer) => ignorer.id === dto.receiverUserId)
    ) {
      throw new AppException(UserError.ALREADY_HAS_IGNORER);
    }
    await this.addIgnorer(user, dto.receiverUserId);
  }

  async removeUserIgnorer(dto: UpdateUserIgnorerDto): Promise<void> {
    const user = await this.usersRepository.findOne({
      relations: ['sentIgnorers'],
      where: { id: dto.senderUserId },
    });
    if (
      !user.sentIgnorers.find((ignorer) => ignorer.id === dto.receiverUserId)
    ) {
      throw new AppException(UserError.NOT_HAS_IGNORER);
    }
    await this.removeIgnorer(user, dto.receiverUserId);
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

  private async addIgnorer(user: User, userId: number): Promise<void> {
    try {
      const ignorer = new User();
      ignorer.id = userId;
      user.sentIgnorers.push(ignorer);
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.ADD_IGNORER_FAILED);
    }
  }

  private async removeIgnorer(user: User, userId: number): Promise<void> {
    try {
      user.sentIgnorers = user.sentIgnorers.filter(
        (user) => user.id !== userId,
      );
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.REMOVE_IGNORER_FAILED);
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
        'city.id',
        'ownerUser.id',
        'ownerUser.nick',
        'ownerUser.avatar',
        'city.name',
        'city.x',
        'city.y',
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
    user['subscribers'] = await this.selectUsersQueryBuilder()
      .innerJoinAndMapOne(
        'subscriber',
        'user.sentSubscribers',
        'subscriber',
        'subscriber.id = :userId',
        { userId: user.id },
      )
      .getMany();
    user['raters'] = await this.selectUsersQueryBuilder()
      .innerJoinAndMapOne(
        'rating',
        'user.sentRatings',
        'rating',
        'rating.receiverUserId = :userId',
        { userId: user.id },
      )
      .getMany();
    return user;
  }

  private async getUserStatsAndRates(userId: number): Promise<User> {
    const rating = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.receivedRatings', 'rating')
      .where('user.id = :userId', { userId })
      .select('AVG(rating.rate)', 'rating')
      .getRawOne();
    const articles = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.articles',
        'articles',
        'article',
        'article.userId = user.id',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(article.id)', 'articles')
      .getRawOne();
    const likes = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.likes',
        'likes',
        'like',
        'like.userId = user.id',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(like.id)', 'likes')
      .getRawOne();
    const comments = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.comments',
        'comments',
        'comment',
        'comment.userId = user.id',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(comment.id)', 'comments')
      .getRawOne();
    const tasks = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.tasks',
        'tasks',
        'task',
        'task.customerUserId = user.id',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(task.id)', 'tasks')
      .getRawOne();
    const plaints = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.plaints',
        'plaints',
        'plaint',
        'plaint.senderUserId = user.id',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(plaint.id)', 'plaints')
      .getRawOne();
    const polls = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.polls',
        'polls',
        'poll',
        'poll.userId = user.id',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(poll.id)', 'polls')
      .getRawOne();
    const votes = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.votes',
        'votes',
        'vote',
        'vote.userId = user.id',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(vote.id)', 'votes')
      .getRawOne();
    const discussions = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.discussions',
        'discussions',
        'discussion',
        'discussion.userId = user.id',
      )
      .where('user.id = :userId', { userId })
      .select('COUNT(discussion.id)', 'discussions')
      .getRawOne();
    const waresCount = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoin('user.cards', 'card')
      .leftJoinAndMapMany(
        'card.rents',
        'rents',
        'rent',
        'card.id = rent.cardId',
      )
      .leftJoin('rent.wares', 'ware')
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
      .leftJoin('lease.products', 'product')
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
      .leftJoin('rent.wares', 'ware')
      .leftJoin('ware.trades', 'trade')
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
      .leftJoin('lease.products', 'product')
      .leftJoin('product.sales', 'sale')
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
    const user = {
      ...rating,
      ...articles,
      ...likes,
      ...comments,
      ...tasks,
      ...plaints,
      ...polls,
      ...votes,
      ...discussions,
      ...waresCount,
      ...productsCount,
      ...ordersCount,
      ...deliveriesCount,
      ...waresRate,
      ...productsRate,
      ...ordersRate,
      ...deliveriesRate,
    };
    Object.keys(user).forEach((key) => (user[key] = +user[key]));
    return user;
  }
}
