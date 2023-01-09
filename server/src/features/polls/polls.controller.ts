import { Body, Controller, Get, Post } from '@nestjs/common';
import { PollsService } from './polls.service';
import { Poll } from './poll.entity';
import { CreatePollDto } from './poll.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Get()
  getMainPolls(@MyId() myId: number): Promise<Poll[]> {
    return this.pollsService.getMainPolls(myId);
  }

  @Get('my')
  getMyPolls(@MyId() myId: number): Promise<Poll[]> {
    return this.pollsService.getMyPolls(myId);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllPolls(@MyId() myId: number): Promise<Poll[]> {
    return this.pollsService.getAllPolls(myId);
  }

  @Post()
  createPoll(@MyId() myId: number, @Body() dto: CreatePollDto): Promise<void> {
    return this.pollsService.createPoll({ ...dto, myId });
  }
}
