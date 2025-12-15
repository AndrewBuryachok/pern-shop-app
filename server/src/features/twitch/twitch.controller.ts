import { Body, Controller, Headers, Param, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { TwitchService } from './twitch.service';
import { ProjectDto } from '../../project.dto';
import { Public } from '../../common/decorators';

@ApiTags(':project/twitch')
@Controller(':project/twitch')
export class TwitchController {
  constructor(private twitchService: TwitchService) {}

  @Public()
  @Post()
  handleEvent(
    @Param() { project }: ProjectDto,
    @Headers() headers,
    @Body() body,
    @Res() res: Response,
  ) {
    const type = headers['twitch-eventsub-message-type'];
    if (type === 'webhook_callback_verification') {
      return res.status(200).type('text/plain').send(body.challenge);
    }
    return this.twitchService.handleEvent(
      project,
      body.subscription.type,
      body.event.broadcaster_user_login,
    );
  }
}
