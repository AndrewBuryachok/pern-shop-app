import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { MqttService } from '../mqtt/mqtt.service';
import { UpdateSubscriberDto } from './subscriber.dto';
import { Request, Response } from '../../common/interfaces';
import { Notification } from '../../common/enums';

@Injectable()
export class SubscribersService {
  constructor(
    private usersService: UsersService,
    private mqttService: MqttService,
  ) {}

  getMySubscribers(myId: number, req: Request): Promise<Response<User>> {
    return this.usersService.getMySubscribers(myId, req);
  }

  getReceivedSubscribers(myId: number, req: Request): Promise<Response<User>> {
    return this.usersService.getReceivedSubscribers(myId, req);
  }

  selectMySubscribers(myId: number): Promise<User[]> {
    return this.usersService.selectMySubscribers(myId);
  }

  async addSubscriber(dto: UpdateSubscriberDto): Promise<void> {
    await this.usersService.addUserSubscriber({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    this.mqttService.publishNotificationMessage(
      dto.userId,
      Notification.ADDED_SUBSCRIBER,
    );
  }

  async removeSubscriber(dto: UpdateSubscriberDto): Promise<void> {
    await this.usersService.removeUserSubscriber({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    this.mqttService.publishNotificationMessage(
      dto.userId,
      Notification.REMOVED_SUBSCRIBER,
    );
  }
}
