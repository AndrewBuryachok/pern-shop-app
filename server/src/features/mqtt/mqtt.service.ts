import { MqttClient, connect } from 'mqtt';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class MqttService {
  private client: MqttClient;
  private users = new Set<number>();
  private notifications = new Map<string, Date>();

  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {
    this.client = connect(process.env.BROKER_URL);
    this.client.on('connect', () =>
      this.client.subscribe([
        process.env.BROKER_TOPIC + 'users/#',
        process.env.BROKER_TOPIC + 'notifications/#',
      ]),
    );
    this.client.on('message', (topic, message) => {
      const userId = +topic.split('/')[2];
      const payload = message.toString();
      if (topic.split('/')[1] === 'users') {
        if (payload) {
          if (!this.users.has(userId)) {
            this.usersService.addUserOnline(userId);
          }
          this.users.add(userId);
        } else {
          if (this.users.has(userId)) {
            this.usersService.removeUserOnline(userId);
          }
          this.users.delete(userId);
        }
      } else {
        const data = topic.split('/').slice(2).join('/');
        if (payload) {
          if (userId) {
            this.notifications.set(data, new Date(payload));
          }
        } else {
          this.notifications.delete(data);
        }
      }
    });
  }

  async getCurrentUsers(): Promise<number[]> {
    const result = [];
    const keys = this.users.keys();
    for (const user of keys) {
      this.publishMessage(`users/${user}`, '', true);
      result.push(user);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    return result;
  }

  async getCurrentNotifications(): Promise<string[]> {
    const result = [];
    const keys = this.notifications.keys();
    const date = new Date();
    date.setDate(date.getDate() - 3);
    for (const notification of keys) {
      if (this.notifications.get(notification).getTime() < date.getTime()) {
        this.publishMessage(`notifications/${notification}`, '', true);
        result.push(notification);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return result;
  }

  async publishNotificationMention(
    id: number,
    text: string,
    nick: string,
    message: string,
  ): Promise<void> {
    const mentions = /@\w+/.exec(text) || [];
    const promises = mentions.map(async (mention) => {
      const user = await this.usersService.findUserByNick(mention.slice(1));
      if (user) {
        this.publishNotificationMessage(id, user.id, nick, message);
      }
    });
    await Promise.all(promises);
  }

  publishNotificationMessage(
    id: number,
    userId: number,
    nick: string,
    message: string,
  ): void {
    const [action, page] = message.split(' ');
    this.publishMessage(
      `notifications/${userId}/${nick}/${action}/${page}/${id}`,
      new Date().toISOString(),
      !!userId,
    );
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
