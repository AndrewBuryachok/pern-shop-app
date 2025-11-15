import { Body, Controller, Headers, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { TwitchService } from './twitch.service';
import { Public } from '../../common/decorators';

@ApiTags('twitch')
@Controller('twitch')
export class TwitchController {
  constructor(private twitchService: TwitchService) {}

  @Public()
  @Post()
  handleEvent(@Headers() headers, @Body() body, @Res() res: Response) {
    const type = headers['twitch-eventsub-message-type'];
    if (type === 'webhook_callback_verification') {
      return res.status(200).type('text/plain').send(body.challenge);
    }
    return this.twitchService.handleEvent(
      body.subscription.type,
      body.event.broadcaster_user_login,
    );
  }
}
