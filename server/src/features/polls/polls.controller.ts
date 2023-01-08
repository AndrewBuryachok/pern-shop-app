import { Controller, Get } from '@nestjs/common';
import { PollsService } from './polls.service';
import { Poll } from './poll.entity';

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
}
