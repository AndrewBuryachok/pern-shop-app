import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PollsService } from './polls.service';
import { Poll } from './poll.entity';
import { CreatePollDto, PollIdDto } from './poll.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('polls')
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

  @Post(':pollId')
  completePoll(
    @MyId() myId: number,
    @Param() { pollId }: PollIdDto,
  ): Promise<void> {
    return this.pollsService.completePoll({ pollId, myId });
  }

  @Delete(':pollId')
  deletePoll(
    @MyId() myId: number,
    @Param() { pollId }: PollIdDto,
  ): Promise<void> {
    return this.pollsService.deletePoll({ pollId, myId });
  }
}
