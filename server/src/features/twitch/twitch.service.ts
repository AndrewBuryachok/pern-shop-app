import { forwardRef, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { MqttService } from '../mqtt/mqtt.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TwitchService {
  constructor(
    @Inject(forwardRef(() => MqttService))
    private mqttService: MqttService,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async handleEvent(
    project: string,
    type: string,
    twitch: string,
  ): Promise<void> {
    const user = await this.usersService.findUserByTwitch(project, twitch);
    if (type === 'stream.online') {
      this.mqttService.publishStreamer(project, user.id, twitch);
    } else if (type === 'stream.offline') {
      this.mqttService.unpublishStreamer(project, user.id);
    }
  }

  async follow(project: string, twitch: string): Promise<void> {
    const token = await this.getToken();
    const userId = await this.getIdByTwitch(twitch, token);
    const subs = await this.getSubscriptions(token, userId);
    if (!subs.length) {
      for (const type of ['stream.online', 'stream.offline'] as const) {
        await this.subscribe(project, type, userId, token);
      }
    }
  }

  async unfollow(twitch: string): Promise<void> {
    const token = await this.getToken();
    const userId = await this.getIdByTwitch(twitch, token);
    const subs = await this.getSubscriptions(token, userId);
    if (subs.length) {
      for (const id of subs) {
        await this.unsubscribe(id, token);
      }
    }
  }

  private async getToken(): Promise<string> {
    const res = await axios.post(
      'https://id.twitch.tv/oauth2/token',
      undefined,
      {
        params: {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          grant_type: 'client_credentials',
        },
      },
    );
    return res.data.access_token;
  }

  private async getIdByTwitch(twitch: string, token: string): Promise<string> {
    const res = await axios.get('https://api.twitch.tv/helix/users', {
      headers: {
        'Client-ID': process.env.CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      params: { login: twitch },
    });
    return res.data.data[0]?.id;
  }

  private async getSubscriptions(
    token: string,
    userId: string,
  ): Promise<string[]> {
    const res = await axios.get(
      'https://api.twitch.tv/helix/eventsub/subscriptions',
      {
        headers: {
          'Client-ID': process.env.CLIENT_ID,
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return res.data.data
      .filter((sub) => sub.condition.broadcaster_user_id === userId)
      .map((sub) => sub.id);
  }

  private async subscribe(
    project: string,
    type: 'stream.online' | 'stream.offline',
    userId: string,
    token: string,
  ): Promise<void> {
    await axios.post(
      'https://api.twitch.tv/helix/eventsub/subscriptions',
      {
        type,
        version: '1',
        condition: { broadcaster_user_id: userId },
        transport: {
          method: 'webhook',
          callback: process.env.CALLBACK_URL.replace(':project', project),
          secret: process.env.CALLBACK_SECRET,
        },
      },
      {
        headers: {
          'Client-ID': process.env.CLIENT_ID,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );
  }

  private async unsubscribe(id: string, token: string): Promise<void> {
    await axios.delete('https://api.twitch.tv/helix/eventsub/subscriptions', {
      headers: {
        'Client-ID': process.env.CLIENT_ID,
        Authorization: `Bearer ${token}`,
      },
      params: { id },
    });
  }
}
