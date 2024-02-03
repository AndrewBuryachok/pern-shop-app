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

  async getMySubscribers(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getSubscribersQueryBuilder(req)
      .innerJoinAndMapOne(
        'subscriber',
        'user.receivedSubscribers',
        'subscriber',
        'subscriber.id = :myId',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedSubscribers(
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getSubscribersQueryBuilder(req)
      .innerJoinAndMapOne(
        'subscriber',
        'user.sentSubscribers',
        'subscriber',
        'subscriber.id = :myId',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  selectMySubscribers(myId: number): Promise<User[]> {
    return this.usersService.selectMySubscribers(myId);
  }

  async addSubscriber(
    dto: UpdateSubscriberDto & { nick: string },
  ): Promise<void> {
    await this.usersService.addUserSubscriber({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    this.mqttService.publishNotificationMessage(
      dto.userId,
      dto.nick,
      Notification.ADDED_SUBSCRIBER,
    );
  }

  async removeSubscriber(
    dto: UpdateSubscriberDto & { nick: string },
  ): Promise<void> {
    await this.usersService.removeUserSubscriber({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    this.mqttService.publishNotificationMessage(
      dto.userId,
      dto.nick,
      Notification.REMOVED_SUBSCRIBER,
    );
  }
}
