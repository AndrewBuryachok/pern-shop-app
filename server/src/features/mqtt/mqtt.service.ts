import { MqttClient, connect } from 'mqtt';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Event } from '../../common/enums';

@Injectable()
export class MqttService {
  private client: MqttClient;
  private usersMap = new Map<string, Map<number, Date>>();
  private notificationsMap = new Map<string, Map<string, Date>>();
  private unnotificationsMap = new Map<string, Map<string, Date>>();

  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {
    const projects = process.env.APP_PROJECTS.split(',');
    const topics = process.env.BROKER_TOPIC.split(',');
    projects.forEach((project) => {
      this.usersMap.set(project, new Map());
      this.notificationsMap.set(project, new Map());
      this.unnotificationsMap.set(project, new Map());
    });
    this.client = connect(process.env.BROKER_URL);
    this.client.on('connect', () =>
      this.client.subscribe(
        topics.flatMap((topic) => [
          topic + '/users/#',
          topic + '/notifications/#',
          topic + '/unnotifications/#',
        ]),
      ),
    );
    this.client.on('message', async (topic, message, packet) => {
      const project = projects[topics.indexOf(topic.split('/')[0])];
      const userId = +topic.split('/')[2];
      const payload = message.toString();
      switch (topic.split('/')[1]) {
        case 'users':
          if (payload) {
            if (!this.usersMap.get(project).has(userId) && !packet.retain) {
              await this.usersService.addUserOnline(project, userId);
            }
            this.usersMap.get(project).set(userId, new Date());
          } else {
            if (this.usersMap.get(project).has(userId) && !packet.retain) {
              await this.usersService.removeUserOnline(project, userId);
            }
            this.usersMap.get(project).delete(userId);
          }
          break;
        case 'notifications':
          const notification = topic.split('/').slice(2).join('/');
          if (payload) {
            this.notificationsMap
              .get(project)
              .set(notification, new Date(payload));
          } else {
            this.notificationsMap.get(project).delete(notification);
            if (!userId) {
              for (const unnotification of this.unnotificationsMap
                .get(project)
                .keys()) {
                if (
                  unnotification.split('/').slice(1).join('/') ===
                  notification.split('/').slice(1).join('/')
                ) {
                  this.publishMessage(
                    project,
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
            this.unnotificationsMap
              .get(project)
              .set(unnotification, new Date(payload));
          } else {
            this.unnotificationsMap.get(project).delete(unnotification);
          }
          break;
        default:
          break;
      }
    });
  }

  getCurrentUsers(project: string): number[] {
    const users = this.usersMap.get(project);
    const result = [];
    const date = new Date();
    date.setMinutes(date.getMinutes() - 15);
    for (const user of users.keys()) {
      if (users.get(user).getTime() < date.getTime()) {
        this.publishMessage(project, `users/${user}`, '', true);
        result.push(user);
      }
    }
    return result;
  }

  getCurrentNotifications(project: string): string[] {
    const notifications = this.notificationsMap.get(project);
    const result = [];
    const date = new Date();
    date.setDate(date.getDate() - 3);
    for (const notification of notifications.keys()) {
      if (notifications.get(notification).getTime() < date.getTime()) {
        this.publishMessage(project, `notifications/${notification}`, '', true);
        result.push(notification);
      }
    }
    return result;
  }

  publishStreamer(project: string, id: number, twitch: string): void {
    this.publishMessage(project, `streamers/${id}`, twitch, true);
  }

  unpublishStreamer(project: string, id: number): void {
    this.publishMessage(project, `streamers/${id}`, '', true);
  }

  publishNotification(
    project: string,
    id: number,
    toUserId: number,
    fromUserId: number,
    message: string,
  ): void {
    const [action, page] = message.split(' ');
    this.publishMessage(
      project,
      `notifications/${toUserId}/${page}/${id}/${action}/${fromUserId}`,
      new Date().toISOString(),
      true,
    );
  }

  unpublishNotification(
    project: string,
    id: number,
    toUserId: number,
    fromUserId: number,
    message: string,
  ): void {
    const [action, page] = message.split(' ');
    this.publishMessage(
      project,
      `notifications/${toUserId}/${page}/${id}/${action}/${fromUserId}`,
      '',
      true,
    );
  }

  publishEvent(
    project: string,
    userId: number,
    page: Event,
    id: number,
    body: string,
  ): void {
    this.publishMessage(project, `events/${userId}/${page}/${id}`, body, false);
  }

  private publishMessage(
    project: string,
    topic: string,
    message: string,
    retain: boolean,
  ): void {
    const projects = process.env.APP_PROJECTS.split(',');
    const topics = process.env.BROKER_TOPIC.split(',');
    this.client.publish(
      topics[projects.indexOf(project)] + '/' + topic,
      message,
      { retain },
    );
  }
}
