import { Body, Controller, Get, Post } from '@nestjs/common';
import { PollsService } from './polls.service';
import { Poll } from './poll.entity';
import { CreatePollDto } from './poll.dto';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Get()
  getMainPolls(myId: number): Promise<Poll[]> {
    return this.pollsService.getMainPolls(myId);
  }

  @Get('my')
  getMyPolls(myId: number): Promise<Poll[]> {
    return this.pollsService.getMyPolls(myId);
  }

  @Get('all')
  getAllPolls(myId: number): Promise<Poll[]> {
    return this.pollsService.getAllPolls(myId);
  }

  @Post()
  createPoll(myId: number, @Body() dto: CreatePollDto): Promise<void> {
    return this.pollsService.createPoll({ ...dto, myId });
  }
}
