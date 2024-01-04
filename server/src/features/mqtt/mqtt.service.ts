import { MqttClient, connect } from 'mqtt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class MqttService {
  private client: MqttClient;
  private onlineUsers = new Map<number, Date>();
  private offlineUsers = new Map<number, Date>();
  private notifications = new Map<string, Date>();

  constructor(private usersService: UsersService) {
    this.client = connect(process.env.BROKER_URL);
    this.client.on('connect', () =>
      this.client.subscribe([
        process.env.BROKER_TOPIC + 'users/#',
        process.env.BROKER_TOPIC + 'notifications/#',
      ]),
    );
    this.client.on('message', async (topic, message) => {
      const userId = +topic.split('/')[2];
      const payload = message.toString();
      if (topic.split('/')[1] === 'users') {
        if (payload) {
          if (!this.onlineUsers.has(userId)) {
            await this.usersService.addUserOnline(userId);
          }
          this.onlineUsers.set(userId, new Date());
          this.offlineUsers.delete(userId);
        } else {
          if (this.onlineUsers.has(userId)) {
            await this.usersService.removeUserOnline(userId);
          }
          this.onlineUsers.delete(userId);
          this.offlineUsers.set(userId, new Date());
        }
      } else {
        const notification = topic.split('/').slice(2).join('/');
        if (payload) {
          if (userId) {
            this.notifications.set(notification, new Date(payload));
          } else {
            for (const user of this.offlineUsers.keys()) {
              this.publishMessage(
                `notifications/${user}${notification.slice(1)}`,
                payload,
                true,
              );
            }
          }
        } else {
          this.notifications.delete(notification);
        }
      }
    });
  }

  getOnlineUsers(): number[] {
    const result = [];
    const date = new Date();
    date.setMinutes(date.getMinutes() - 15);
    for (const user of this.onlineUsers.keys()) {
      if (this.onlineUsers.get(user).getTime() < date.getTime()) {
        this.publishMessage(`users/${user}`, '', true);
        result.push(user);
      }
    }
    return result;
  }

  getOfflineUsers(): number[] {
    const result = [];
    const date = new Date();
    date.setDate(date.getDate() - 1);
    for (const user of this.offlineUsers.keys()) {
      if (this.offlineUsers.get(user).getTime() < date.getTime()) {
        this.offlineUsers.delete(user);
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
