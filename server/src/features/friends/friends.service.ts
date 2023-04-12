import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository, SelectQueryBuilder } from 'typeorm';
import { Friend } from './friend.entity';
import { ExtCreateFriendDto, UpdateFriendDto } from './friend.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { FriendError } from './friend-error.enum';
import { Filter, Mode } from '../../common/enums';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private friendsRepository: Repository<Friend>,
  ) {}

  async getMainFriends(req: Request): Promise<Response<Friend>> {
    const [result, count] = await this.getFriendsQueryBuilder(req)
      .andWhere('friend.type')
      .getManyAndCount();
    return { result, count };
  }

  async getMyFriends(myId: number, req: Request): Promise<Response<Friend>> {
    const [result, count] = await this.getFriendsQueryBuilder(req)
      .andWhere(
        new Brackets((qb) =>
          qb.where('senderUser.id = :myId').orWhere('receiverUser.id = :myId'),
        ),
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getAllFriends(req: Request): Promise<Response<Friend>> {
    const [result, count] = await this.getFriendsQueryBuilder(
      req,
    ).getManyAndCount();
    return { result, count };
  }

  async createFriend(dto: ExtCreateFriendDto): Promise<void> {
    const friend1 = await this.friendsRepository.findOneBy({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    const friend2 = await this.friendsRepository.findOneBy({
      senderUserId: dto.userId,
      receiverUserId: dto.myId,
    });
    if (friend1 || (friend2 && friend2.type)) {
      throw new AppException(FriendError.ALREADY_FRIENDS);
    }
    if (!friend2) {
      await this.create(dto);
    } else {
      await this.add(friend2);
    }
  }

  async addFriend(dto: UpdateFriendDto): Promise<void> {
    const friend = await this.friendsRepository.findOneBy({
      id: dto.friendId,
      receiverUserId: dto.myId,
    });
    if (!friend) {
      throw new AppException(FriendError.NOT_RECEIVER);
    }
    await this.add(friend);
  }

  async removeFriend(dto: UpdateFriendDto): Promise<void> {
    const friend = await this.friendsRepository.findOneBy({
      id: dto.friendId,
    });
    if (
      friend.senderUserId !== dto.myId &&
      friend.receiverUserId !== dto.myId
    ) {
      throw new AppException(FriendError.NOT_FRIENDS);
    }
    await this.remove(friend);
  }

  async checkFriendExists(id: number): Promise<void> {
    await this.friendsRepository.findOneByOrFail({ id });
  }

  private async create(dto: ExtCreateFriendDto): Promise<void> {
    try {
      const friend = this.friendsRepository.create({
        senderUserId: dto.myId,
        receiverUserId: dto.userId,
        type: dto.userId === dto.myId,
      });
      await this.friendsRepository.save(friend);
    } catch (error) {
      throw new AppException(FriendError.CREATE_FAILED);
    }
  }

  private async add(friend: Friend): Promise<void> {
    try {
      friend.type = true;
      await this.friendsRepository.save(friend);
    } catch (error) {
      throw new AppException(FriendError.ADD_FAILED);
    }
  }

  private async remove(friend: Friend): Promise<void> {
    try {
      await this.friendsRepository.remove(friend);
    } catch (error) {
      throw new AppException(FriendError.REMOVE_FAILED);
    }
  }

  private getFriendsQueryBuilder(req: Request): SelectQueryBuilder<Friend> {
    return this.friendsRepository
      .createQueryBuilder('friend')
      .innerJoin('friend.senderUser', 'senderUser')
      .innerJoin('friend.receiverUser', 'receiverUser')
      .where(
        new Brackets((qb) =>
          qb
            .where(`${!req.user}`)
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.SOME}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes(Filter.SENDER)}`)
                              .andWhere('senderUser.id = :userId'),
                          ),
                        )
                        .orWhere(
                          new Brackets((qb) =>
                            qb
                              .where(`${req.filters.includes(Filter.RECEIVER)}`)
                              .andWhere('receiverUser.id = :userId'),
                          ),
                        ),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.EACH}`)
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.SENDER)}`)
                        .orWhere('senderUser.id = :userId'),
                    ),
                  )
                  .andWhere(
                    new Brackets((qb) =>
                      qb
                        .where(`${!req.filters.includes(Filter.RECEIVER)}`)
                        .orWhere('receiverUser.id = :userId'),
                    ),
                  ),
              ),
            )
            .orWhere(
              new Brackets((qb) =>
                qb
                  .where(`${req.mode === Mode.ONLY}`)
                  .andWhere(
                    `senderUser.id ${
                      req.filters.includes(Filter.SENDER) ? '=' : '!='
                    } :userId`,
                  )
                  .andWhere(
                    `receiverUser.id ${
                      req.filters.includes(Filter.RECEIVER) ? '=' : '!='
                    } :userId`,
                  ),
              ),
            ),
        ),
        { userId: req.user },
      )
      .andWhere(
        new Brackets((qb) =>
          qb
            .where(`${!req.type}`)
            .orWhere('friend.type = :type', { type: req.type === 1 }),
        ),
      )
      .orderBy('friend.id', 'DESC')
      .skip(req.skip)
      .take(req.take)
      .select([
        'friend.id',
        'senderUser.id',
        'senderUser.name',
        'senderUser.status',
        'receiverUser.id',
        'receiverUser.name',
        'receiverUser.status',
        'friend.type',
        'friend.createdAt',
      ]);
  }
}
