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
      const userId = +topic.split('/')[2];
      if (message.toString()) {
        this.usersService.addUserOnline(userId);
      } else {
        this.usersService.removeUserOnline(userId);
      }
    });
  }

  publishNotificationMessage(id: number, message: string): void {
    this.publishMessage('notifications/' + id, message);
  }

  async publishNotificationMention(
    text: string,
    message: string,
  ): Promise<void> {
    const nicks = /@\w+/.exec(text) || [];
    nicks.forEach(async (nick) => {
      const user = await this.usersService.findUserByNick(nick.slice(1));
      if (user) {
        this.publishNotificationMessage(user.id, message);
      }
    });
  }

  private publishMessage(topic: string, message: string): void {
    this.client.publish(process.env.BROKER_TOPIC + topic, message);
  }
}
