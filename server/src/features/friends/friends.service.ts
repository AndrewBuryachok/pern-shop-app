import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invitation } from './invitation.entity';
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
    @InjectRepository(Invitation)
    private invitationsRepository: Repository<Invitation>,
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
        'user.invitations',
        'invitations',
        'invitation',
        'invitation.receiverUserId = user.id',
      )
      .andWhere('invitation.senderUserId = :myId', { myId })
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
        'user.invitations',
        'invitations',
        'invitation',
        'invitation.senderUserId = user.id',
      )
      .andWhere('invitation.receiverUserId = :myId', { myId })
      .getManyAndCount();
    return { result, count };
  }

  async addFriend(dto: UpdateFriendDto & { nick: string }): Promise<void> {
    if (dto.userId === dto.myId) {
      throw new AppException(FriendError.SENDER);
    }
    const invitation1 = await this.invitationsRepository.findOneBy({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    if (invitation1) {
      throw new AppException(FriendError.ALREADY_INVITED);
    }
    const invitation2 = await this.invitationsRepository.findOneBy({
      senderUserId: dto.userId,
      receiverUserId: dto.myId,
    });
    if (!invitation2) {
      await this.usersService.checkNotFriends(dto.myId, dto.userId);
      await this.create(dto);
      this.mqttService.publishNotificationMessage(
        dto.myId,
        dto.userId,
        dto.nick,
        Notification.INVITED_FRIEND,
      );
    } else {
      await this.usersService.addUserFriend({
        senderUserId: dto.myId,
        receiverUserId: dto.userId,
      });
      await this.usersService.addUserFriend({
        senderUserId: dto.userId,
        receiverUserId: dto.myId,
      });
      await this.delete(invitation2);
      this.mqttService.publishNotificationMessage(
        dto.myId,
        dto.userId,
        dto.nick,
        Notification.APPROVED_FRIEND,
      );
    }
  }

  async removeFriend(dto: UpdateFriendDto & { nick: string }): Promise<void> {
    const invitation1 = await this.invitationsRepository.findOneBy({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    const invitation2 = await this.invitationsRepository.findOneBy({
      senderUserId: dto.userId,
      receiverUserId: dto.myId,
    });
    if (invitation1) {
      await this.delete(invitation1);
      this.mqttService.publishNotificationMessage(
        dto.myId,
        dto.userId,
        dto.nick,
        Notification.CANCELED_FRIEND,
      );
    } else if (invitation2) {
      await this.delete(invitation2);
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
      await this.usersService.removeUserFriend({
        senderUserId: dto.userId,
        receiverUserId: dto.myId,
      });
      this.mqttService.publishNotificationMessage(
        dto.myId,
        dto.userId,
        dto.nick,
        Notification.DELETED_FRIENDS,
      );
    }
  }

  private async create(dto: UpdateFriendDto): Promise<Invitation> {
    try {
      const invitation = this.invitationsRepository.create({
        senderUserId: dto.myId,
        receiverUserId: dto.userId,
      });
      await this.invitationsRepository.save(invitation);
      return invitation;
    } catch (error) {
      throw new AppException(FriendError.CREATE_FAILED);
    }
  }

  private async delete(invitation: Invitation): Promise<void> {
    try {
      await this.invitationsRepository.remove(invitation);
    } catch (error) {
      throw new AppException(FriendError.DELETE_FAILED);
    }
  }
}
