import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Database } from '../../database.enum';
import { Offer } from './offer.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { MqttService } from '../mqtt/mqtt.service';
import { UpdateFriendDto } from './friend.dto';
import { Request, Response } from '../../common/interfaces';
import { AppException } from '../../common/exceptions';
import { FriendError } from './friend-error.enum';
import { Notification } from '../../common/enums';

@Injectable()
export class FriendsService {
  private offersRepositoryMap: Map<string, Repository<Offer>>;

  constructor(
    @InjectRepository(Offer, Database.DB1)
    private offers1Repository: Repository<Offer>,
    @InjectRepository(Offer, Database.DB2)
    private offers2Repository: Repository<Offer>,
    private usersService: UsersService,
    private mqttService: MqttService,
  ) {
    this.offersRepositoryMap = new Map(
      [this.offers1Repository, this.offers2Repository].map(
        (repository, index) => [
          process.env.APP_PROJECTS.split(',')[index],
          repository,
        ],
      ),
    );
  }

  async getMyFriends(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getFriendsQueryBuilder(project, req)
      .leftJoin('user.friends', 'friend')
      .andWhere('friend.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getSentFriends(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getFriendsQueryBuilder(project, req)
      .leftJoinAndMapMany(
        'user.offers',
        'offers',
        'offer',
        'offer.receiverUserId = user.id',
      )
      .andWhere('offer.senderUserId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedFriends(
    project: string,
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getFriendsQueryBuilder(project, req)
      .leftJoinAndMapMany(
        'user.offers',
        'offers',
        'offer',
        'offer.senderUserId = user.id',
      )
      .andWhere('offer.receiverUserId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async addFriend(project: string, dto: UpdateFriendDto): Promise<void> {
    if (dto.userId === dto.myId) {
      throw new AppException(FriendError.SELF);
    }
    const offer1 = await this.offersRepositoryMap.get(project).findOneBy({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    if (offer1 && dto.myId !== dto.userId) {
      throw new AppException(FriendError.ALREADY_OFFERED);
    }
    const offer2 = await this.offersRepositoryMap.get(project).findOneBy({
      senderUserId: dto.userId,
      receiverUserId: dto.myId,
    });
    if (!offer2) {
      await this.usersService.checkNotFriends(project, dto.myId, dto.userId);
      await this.create(project, dto);
      this.mqttService.publishNotification(
        project,
        dto.myId,
        dto.userId,
        dto.myId,
        Notification.OFFERED_FRIEND,
      );
    } else {
      await this.usersService.addUserFriend(project, {
        senderUserId: dto.myId,
        receiverUserId: dto.userId,
      });
      if (dto.myId !== dto.userId) {
        await this.usersService.addUserFriend(project, {
          senderUserId: dto.userId,
          receiverUserId: dto.myId,
        });
      }
      await this.delete(project, offer2);
      this.mqttService.publishNotification(
        project,
        dto.myId,
        dto.userId,
        dto.myId,
        Notification.ACCEPTED_FRIEND,
      );
    }
  }

  async removeFriend(project: string, dto: UpdateFriendDto): Promise<void> {
    const offer1 = await this.offersRepositoryMap.get(project).findOneBy({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    const offer2 = await this.offersRepositoryMap.get(project).findOneBy({
      senderUserId: dto.userId,
      receiverUserId: dto.myId,
    });
    if (offer1) {
      await this.delete(project, offer1);
      this.mqttService.publishNotification(
        project,
        dto.myId,
        dto.userId,
        dto.myId,
        Notification.CANCELED_FRIEND,
      );
    } else if (offer2) {
      await this.delete(project, offer2);
      this.mqttService.publishNotification(
        project,
        dto.myId,
        dto.userId,
        dto.myId,
        Notification.REJECTED_FRIEND,
      );
    } else {
      await this.usersService.removeUserFriend(project, {
        senderUserId: dto.myId,
        receiverUserId: dto.userId,
      });
      if (dto.myId !== dto.userId) {
        await this.usersService.removeUserFriend(project, {
          senderUserId: dto.userId,
          receiverUserId: dto.myId,
        });
      }
      this.mqttService.publishNotification(
        project,
        dto.myId,
        dto.userId,
        dto.myId,
        Notification.DELETED_FRIEND,
      );
    }
  }

  private async create(project: string, dto: UpdateFriendDto): Promise<Offer> {
    try {
      const offer = this.offersRepositoryMap.get(project).create({
        senderUserId: dto.myId,
        receiverUserId: dto.userId,
      });
      await this.offersRepositoryMap.get(project).save(offer);
      return offer;
    } catch (error) {
      throw new AppException(FriendError.CREATE_FAILED);
    }
  }

  private async delete(project: string, offer: Offer): Promise<void> {
    try {
      await this.offersRepositoryMap.get(project).remove(offer);
    } catch (error) {
      throw new AppException(FriendError.DELETE_FAILED);
    }
  }
}
