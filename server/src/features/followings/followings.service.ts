import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { MqttService } from '../mqtt/mqtt.service';
import { UpdateFollowingDto } from './following.dto';
import { Request, Response } from '../../common/interfaces';
import { Notification } from '../../common/enums';

@Injectable()
export class FollowingsService {
  constructor(
    private usersService: UsersService,
    private mqttService: MqttService,
  ) {}

  getMyFollowings(myId: number, req: Request): Promise<Response<User>> {
    return this.usersService.getMyFollowings(myId, req);
  }

  getReceivedFollowings(myId: number, req: Request): Promise<Response<User>> {
    return this.usersService.getReceivedFollowings(myId, req);
  }

  async addFollowing(dto: UpdateFollowingDto): Promise<void> {
    await this.usersService.addUserFollowing({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    this.mqttService.publishNotificationMessage(
      dto.userId,
      Notification.ADDED_FOLLOWING,
    );
  }

  async removeFollowing(dto: UpdateFollowingDto): Promise<void> {
    await this.usersService.removeUserFollowing({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    this.mqttService.publishNotificationMessage(
      dto.userId,
      Notification.REMOVED_FOLLOWING,
    );
  }
}
