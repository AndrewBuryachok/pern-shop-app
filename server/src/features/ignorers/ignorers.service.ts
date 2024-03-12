import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { MqttService } from '../mqtt/mqtt.service';
import { UpdateIgnorerDto } from './ignorer.dto';
import { Request, Response } from '../../common/interfaces';
import { Notification } from '../../common/enums';

@Injectable()
export class IgnorersService {
  constructor(
    private usersService: UsersService,
    private mqttService: MqttService,
  ) {}

  async getMyIgnorers(myId: number, req: Request): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getIgnorersQueryBuilder(req)
      .innerJoinAndMapOne(
        'ignorer',
        'user.receivedIgnorers',
        'ignorer',
        'ignorer.id = :myId',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  async getReceivedIgnorers(
    myId: number,
    req: Request,
  ): Promise<Response<User>> {
    const [result, count] = await this.usersService
      .getIgnorersQueryBuilder(req)
      .innerJoinAndMapOne(
        'ignorer',
        'user.sentIgnorers',
        'ignorer',
        'ignorer.id = :myId',
        { myId },
      )
      .getManyAndCount();
    return { result, count };
  }

  selectMyIgnorers(myId: number): Promise<User[]> {
    return this.usersService.selectMyIgnorers(myId);
  }

  async addIgnorer(dto: UpdateIgnorerDto & { nick: string }): Promise<void> {
    await this.usersService.addUserIgnorer({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    this.mqttService.publishNotificationMessage(
      dto.myId,
      dto.userId,
      dto.nick,
      Notification.ADDED_IGNORER,
    );
  }

  async removeIgnorer(dto: UpdateIgnorerDto & { nick: string }): Promise<void> {
    await this.usersService.removeUserIgnorer({
      senderUserId: dto.myId,
      receiverUserId: dto.userId,
    });
    this.mqttService.publishNotificationMessage(
      dto.myId,
      dto.userId,
      dto.nick,
      Notification.REMOVED_IGNORER,
    );
  }
}
