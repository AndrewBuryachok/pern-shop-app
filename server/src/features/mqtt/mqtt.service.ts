import { MqttClient, connect } from 'mqtt';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class MqttService {
  private client: MqttClient;

  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {
    this.client = connect(process.env.BROKER_URL);
    this.client.on('connect', () =>
      this.client.subscribe(process.env.BROKER_TOPIC + 'users/#'),
    );
    this.client.on('message', (topic, message) => {
      const id = +topic.split('/')[2];
      if (message.toString()) {
        this.usersService.addUserOnline(id);
      } else {
        this.usersService.removeUserOnline(id);
      }
    });
  }

  async publishNotificationMention(
    text: string,
    nick: string,
    message: string,
  ): Promise<void> {
    const mentions = /@\w+/.exec(text) || [];
    const promises = mentions.map(async (mention) => {
      const user = await this.usersService.findUserByNick(mention.slice(1));
      if (user) {
        this.publishNotificationMessage(user.id, nick, message);
      }
    });
    await Promise.all(promises);
  }

  publishNotificationMessage(id: number, nick: string, message: string): void {
    const [action, page] = message.split(' ');
    this.publishMessage(`notifications/${id}/${nick}/${action}/${page}`, !!id);
  }

  private publishMessage(topic: string, retain: boolean): void {
    this.client.publish(
      process.env.BROKER_TOPIC + topic,
      new Date().toISOString(),
      { retain },
    );
  }
}
