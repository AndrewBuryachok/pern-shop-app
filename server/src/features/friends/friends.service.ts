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

  getMyFriends(myId: number, req: Request): Promise<Response<User>> {
    return this.usersService.getMyFriends(myId, req);
  }

  getSentFriends(myId: number, req: Request): Promise<Response<User>> {
    return this.usersService.getSentFriends(myId, req);
  }

  getReceivedFriends(myId: number, req: Request): Promise<Response<User>> {
    return this.usersService.getReceivedFriends(myId, req);
  }

  async addFriend(dto: UpdateFriendDto): Promise<void> {
    const invitation1 = await this.invitationsRepository.findOneBy({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    if (invitation1 && dto.myId !== dto.userId) {
      throw new AppException(FriendError.ALREADY_INVITED);
    }
    const invitation2 = await this.invitationsRepository.findOneBy({
      senderUserId: dto.userId,
      receiverUserId: dto.myId,
    });
    if (!invitation2) {
      await this.usersService.checkNotFriends(dto.myId, dto.userId);
      await this.create(dto);
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
      await this.delete(invitation2);
    }
    this.mqttService.publishNotificationMessage(
      dto.userId,
      dto.myId,
      Notification.ADDED_FRIEND,
    );
  }

  async removeFriend(dto: UpdateFriendDto): Promise<void> {
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
    } else if (invitation2) {
      await this.delete(invitation2);
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
    }
    this.mqttService.publishNotificationMessage(
      dto.userId,
      dto.myId,
      Notification.REMOVED_FRIEND,
    );
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
