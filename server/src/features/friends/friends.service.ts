import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
    private usersService: UsersService,
    private mqttService: MqttService,
  ) {}

  async getMyFriends(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getFriendsQueryBuilder(req)
      .leftJoin('user.friends', 'friend')
      .andWhere('friend.id = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async getSentFriends(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getFriendsQueryBuilder(req)
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
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getFriendsQueryBuilder(req)
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

  async addFriend(dto: UpdateFriendDto & { nick: string }): Promise<void> {
    const offer1 = await this.offersRepository.findOneBy({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    if (offer1 && dto.myId !== dto.userId) {
      throw new AppException(FriendError.ALREADY_OFFERED);
    }
    const offer2 = await this.offersRepository.findOneBy({
      senderUserId: dto.userId,
      receiverUserId: dto.myId,
    });
    if (!offer2) {
      await this.usersService.checkNotFriends(dto.myId, dto.userId);
      await this.create(dto);
      this.mqttService.publishNotificationMessage(
        dto.myId,
        dto.userId,
        dto.nick,
        Notification.OFFERED_FRIEND,
      );
    } else {
      await this.usersService.addUserFriend({
        senderUserId: dto.myId,
        receiverUserId: dto.userId,
      });
      if (dto.myId !== dto.userId) {
        await this.usersService.addUserFriend({
          senderUserId: dto.userId,
          receiverUserId: dto.myId,
        });
      }
      await this.delete(offer2);
      this.mqttService.publishNotificationMessage(
        dto.myId,
        dto.userId,
        dto.nick,
        Notification.APPROVED_FRIEND,
      );
    }
  }

  async removeFriend(dto: UpdateFriendDto & { nick: string }): Promise<void> {
    const offer1 = await this.offersRepository.findOneBy({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    const offer2 = await this.offersRepository.findOneBy({
      senderUserId: dto.userId,
      receiverUserId: dto.myId,
    });
    if (offer1) {
      await this.delete(offer1);
      this.mqttService.publishNotificationMessage(
        dto.myId,
        dto.userId,
        dto.nick,
        Notification.CANCELED_FRIEND,
      );
    } else if (offer2) {
      await this.delete(offer2);
      this.mqttService.publishNotificationMessage(
        dto.myId,
        dto.userId,
        dto.nick,
        Notification.REJECTED_FRIEND,
      );
    } else {
      await this.usersService.removeUserFriend({
        senderUserId: dto.myId,
        receiverUserId: dto.userId,
      });
      if (dto.myId !== dto.userId) {
        await this.usersService.removeUserFriend({
          senderUserId: dto.userId,
          receiverUserId: dto.myId,
        });
      }
      this.mqttService.publishNotificationMessage(
        dto.myId,
        dto.userId,
        dto.nick,
        Notification.DELETED_FRIENDS,
      );
    }
  }

  private async create(dto: UpdateFriendDto): Promise<Offer> {
    try {
      const offer = this.offersRepository.create({
        senderUserId: dto.myId,
        receiverUserId: dto.userId,
      });
      await this.offersRepository.save(offer);
      return offer;
    } catch (error) {
      throw new AppException(FriendError.CREATE_FAILED);
    }
  }

  private async delete(offer: Offer): Promise<void> {
    try {
      await this.offersRepository.remove(offer);
    } catch (error) {
      throw new AppException(FriendError.DELETE_FAILED);
    }
  }
}
