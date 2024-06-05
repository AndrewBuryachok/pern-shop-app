import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TwitchService {
  constructor(private httpService: HttpService) {}

  async getToken(): Promise<string> {
    try {
      const response: AxiosResponse<{ access_token: string }> =
        await firstValueFrom(
          this.httpService.post(
            `https://id.twitch.tv/oauth2/token?client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials`,
          ),
        );
      return response.data.access_token;
    } catch (error) {
      return '';
    }
  }

  async getStreams(users: string[]): Promise<string[]> {
    try {
      const token = await this.getToken();
      const response: AxiosResponse<{ data: { user_login: string }[] }> =
        await firstValueFrom(
          this.httpService.get(
            `https://api.twitch.tv/helix/streams?user_login=${users.join(
              '&user_login=',
            )}`,
            {
              headers: {
                'Client-ID': process.env.CLIENT_ID,
                Authorization: `Bearer ${token}`,
              },
            },
          ),
        );
      return response.data.data.map((user) => user.user_login);
    } catch (error) {
      return [];
    }
  }
}
