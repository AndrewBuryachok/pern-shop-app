import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import { CitiesService } from '../cities/cities.service';
import {
  CreateUserDto,
  ExtUpdateUserCityDto,
  ExtUpdateUserRolesDto,
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
    @Inject(forwardRef(() => CitiesService))
    private citiesService: CitiesService,
  ) {}

  async getMainUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadCardsAndFriends(result);
    return { result, count };
  }

  async getMyUsers(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(req)
      .andWhere('city.userId = :myId', { myId })
      .getManyAndCount();
    await this.loadCardsAndFriends(result);
    return { result, count };
  }

  async getAllUsers(req: Request): Promise<Response<User>> {
    const [result, count] = await this.getUsersQueryBuilder(
      req,
    ).getManyAndCount();
    await this.loadCardsAndFriends(result);
    return { result, count };
  }

  selectAllUsers(): Promise<User[]> {
    return this.selectUsersQueryBuilder().addSelect('user.cityId').getMany();
  }

  selectNotCitizensUsers(): Promise<User[]> {
    return this.selectUsersQueryBuilder().where('user.city IS NULL').getMany();
  }

  async selectNotFriendsUsers(myId: number): Promise<User[]> {
    const allUsers = await this.selectUsersQueryBuilder().getMany();
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .leftJoinAndMapMany(
        'user.friends',
        'friends',
        'friend',
        'user.id = friend.senderUserId OR user.id = friend.receiverUserId',
      )
      .where('user.id = :myId', { myId })
      .getOne();
    const friends = result['friends']
      .filter((friend) => friend.senderUserId === myId || friend.type)
      .map((friend) =>
        friend.senderUserId === myId
          ? friend.receiverUserId
          : friend.senderUserId,
      );
    return allUsers.filter((user) => !friends.includes(user.id));
  }

  async getSingleUser(userId: number): Promise<User> {
    const user = await this.getUserQueryBuilder()
      .where('user.id = :userId', { userId })
      .getOne();
    await this.loadCardsAndFriends([user]);
    ['goods', 'wares', 'products', 'trades', 'sales'].forEach(
      (stat) => (user[stat] = user[stat].length),
    );
    user['rating'] =
      user['ratings'].map((rating) => rating.rate).reduce((a, b) => a + b, 0) /
        user['ratings'].length || 0;
    delete user['shops'];
    delete user['rents'];
    delete user['ratings'];
    return user;
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

  async addUserRole(dto: ExtUpdateUserRolesDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (user.roles.includes(dto.role)) {
      throw new AppException(UserError.ALREADY_HAS_ROLE);
    }
    await this.addRole(user, dto.role);
  }

  async removeUserRole(dto: ExtUpdateUserRolesDto): Promise<void> {
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (!user.roles.includes(dto.role)) {
      throw new AppException(UserError.NOT_HAS_ROLE);
    }
    await this.removeRole(user, dto.role);
  }

  async addUserCity(dto: ExtUpdateUserCityDto): Promise<void> {
    await this.citiesService.checkCityOwner(dto.cityId, dto.myId);
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (user.cityId) {
      throw new AppException(UserError.ALREADY_IN_CITY);
    }
    await this.addCity(user, dto.cityId);
  }

  async removeUserCity(dto: ExtUpdateUserCityDto): Promise<void> {
    await this.citiesService.checkCityOwner(dto.cityId, dto.myId);
    const user = await this.usersRepository.findOneBy({ id: dto.userId });
    if (user.cityId !== dto.cityId) {
      throw new AppException(UserError.NOT_IN_CITY);
    }
    await this.removeCity(user);
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

  private async addCity(user: User, cityId: number): Promise<void> {
    try {
      user.cityId = cityId;
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.ADD_CITY_FAILED);
    }
  }

  private async removeCity(user: User): Promise<void> {
    try {
      user.cityId = null;
      await this.usersRepository.save(user);
    } catch (error) {
      throw new AppException(UserError.REMOVE_CITY_FAILED);
    }
  }

  private selectUsersQueryBuilder(): SelectQueryBuilder<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .orderBy('user.status', 'DESC')
      .addOrderBy('user.name', 'ASC')
      .select(['user.id', 'user.name', 'user.status']);
  }

  private async loadCardsAndFriends(users: User[]): Promise<void> {
    const allUsers = await this.selectUsersQueryBuilder().getMany();
    const promises = users.map(async (user) => {
      const result = await this.usersRepository
        .createQueryBuilder('user')
        .leftJoinAndMapMany(
          'user.cards',
          'cards',
          'card',
          'user.id = card.userId',
        )
        .leftJoinAndMapMany(
          'user.friends',
          'friends',
          'friend',
          'user.id = friend.senderUserId OR user.id = friend.receiverUserId',
        )
        .where('user.id = :userId', { userId: user.id })
        .orderBy('card.id', 'ASC')
        .select([
          'user.id',
          'card.id',
          'card.name',
          'card.color',
          'friend.senderUserId',
          'friend.receiverUserId',
          'friend.type',
        ])
        .getOne();
      user['cards'] = result['cards'];
      const friends = result['friends']
        .filter((friend) => friend.type)
        .map((friend) =>
          friend.senderUserId === user.id
            ? friend.receiverUserId
            : friend.senderUserId,
        );
      user['friends'] = allUsers.filter((user) => friends.includes(user.id));
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
        'ownerUser.roles',
        'city.name',
        'city.x',
        'city.y',
      ]);
  }

  private getUserQueryBuilder(): SelectQueryBuilder<User> {
    return this.getUsersQueryBuilder({})
      .leftJoinAndMapMany(
        'user.cards',
        'cards',
        'card',
        'user.id = card.userId',
      )
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
      .leftJoinAndMapMany(
        'user.ratings',
        'ratings',
        'rating',
        'user.id = rating.receiverUserId',
      );
  }
}
