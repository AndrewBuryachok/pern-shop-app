import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PollsService } from './polls.service';
import { Poll } from './poll.entity';
import { CreatePollDto } from './poll.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Get()
  getMainPolls(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Poll>> {
    return this.pollsService.getMainPolls(myId, req);
  }

  @Get('my')
  getMyPolls(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Poll>> {
    return this.pollsService.getMyPolls(myId, req);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllPolls(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Poll>> {
    return this.pollsService.getAllPolls(myId, req);
  }

  @Post()
  createPoll(@MyId() myId: number, @Body() dto: CreatePollDto): Promise<void> {
    return this.pollsService.createPoll({ ...dto, myId });
  }
}
