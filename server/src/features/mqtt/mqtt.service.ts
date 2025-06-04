import { MqttClient, connect } from 'mqtt';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Event } from '../../common/enums';

@Injectable()
export class MqttService {
  private client: MqttClient;
  private users = new Map<number, Date>();
  private notifications = new Map<string, Date>();
  private unnotifications = new Map<string, Date>();

  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {
    this.client = connect(process.env.BROKER_URL);
    this.client.on('connect', () =>
      this.client.subscribe([
        process.env.BROKER_TOPIC + 'users/#',
        process.env.BROKER_TOPIC + 'notifications/#',
        process.env.BROKER_TOPIC + 'unnotifications/#',
      ]),
    );
    this.client.on('message', async (topic, message) => {
      const userId = +topic.split('/')[2];
      const payload = message.toString();
      switch (topic.split('/')[1]) {
        case 'users':
          if (payload) {
            if (!this.users.has(userId)) {
              await this.usersService.addUserOnline(userId);
            }
            this.users.set(userId, new Date());
          } else {
            if (this.users.has(userId)) {
              await this.usersService.removeUserOnline(userId);
            }
            this.users.delete(userId);
          }
          break;
        case 'notifications':
          const notification = topic.split('/').slice(2).join('/');
          if (payload) {
            this.notifications.set(notification, new Date(payload));
          } else {
            this.notifications.delete(notification);
            if (!userId) {
              for (const unnotification of this.unnotifications.keys()) {
                if (
                  unnotification.split('/').slice(1).join('/') ===
                  notification.split('/').slice(1).join('/')
                ) {
                  this.publishMessage(
                    `unnotifications/${unnotification}`,
                    '',
                    true,
                  );
                }
              }
            }
          }
          break;
        case 'unnotifications':
          const unnotification = topic.split('/').slice(2).join('/');
          if (payload) {
            this.unnotifications.set(unnotification, new Date(payload));
          } else {
            this.unnotifications.delete(unnotification);
          }
          break;
        default:
          break;
      }
    });
  }

  getCurrentUsers(): number[] {
    const result = [];
    const date = new Date();
    date.setMinutes(date.getMinutes() - 15);
    for (const user of this.users.keys()) {
      if (this.users.get(user).getTime() < date.getTime()) {
        this.publishMessage(`users/${user}`, '', true);
        result.push(user);
      }
    }
    return result;
  }

  getCurrentNotifications(): string[] {
    const result = [];
    const date = new Date();
    date.setDate(date.getDate() - 3);
    for (const notification of this.notifications.keys()) {
      if (this.notifications.get(notification).getTime() < date.getTime()) {
        this.publishMessage(`notifications/${notification}`, '', true);
        result.push(notification);
      }
    }
    return result;
  }

  publishNotification(
    id: number,
    toUserId: number,
    fromUserId: number,
    message: string,
  ): void {
    const [action, page] = message.split(' ');
    this.publishMessage(
      `notifications/${toUserId}/${page}/${id}/${action}/${fromUserId}`,
      new Date().toISOString(),
      true,
    );
  }

  unpublishNotification(
    id: number,
    toUserId: number,
    fromUserId: number,
    message: string,
  ): void {
    const [action, page] = message.split(' ');
    this.publishMessage(
      `notifications/${toUserId}/${page}/${id}/${action}/${fromUserId}`,
      '',
      true,
    );
  }

  publishEvent(userId: number, page: Event, id: number, body: string): void {
    this.publishMessage(`events/${userId}/${page}/${id}`, body, false);
  }

  private publishMessage(
    topic: string,
    message: string,
    retain: boolean,
  ): void {
    this.client.publish(process.env.BROKER_TOPIC + topic, message, {
      retain,
    });
  }
}
