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
import {
  CompletePollDto,
  CreatePollDto,
  PollIdDto,
  VotePollDto,
} from './poll.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('polls')
@Controller('polls')
export class PollsController {
  constructor(private pollsService: PollsService) {}

  @Public()
  @Get()
  getMainPolls(@Query() req: Request): Promise<Response<Poll>> {
    return this.pollsService.getMainPolls(req);
  }

  @Get('my')
  getMyPolls(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Poll>> {
    return this.pollsService.getMyPolls(myId, req);
  }

  @Get('voted')
  getVotedPolls(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Poll>> {
    return this.pollsService.getVotedPolls(myId, req);
  }

  @Get('discussed')
  getDiscussedPolls(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Poll>> {
    return this.pollsService.getDiscussedPolls(myId, req);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllPolls(@Query() req: Request): Promise<Response<Poll>> {
    return this.pollsService.getAllPolls(req);
  }

  @Post()
  createPoll(@MyId() myId: number, @Body() dto: CreatePollDto): Promise<void> {
    return this.pollsService.createPoll({ ...dto, myId });
  }

  @Roles(Role.ADMIN)
  @Post(':pollId')
  completePoll(
    @Param() { pollId }: PollIdDto,
    @Body() dto: CompletePollDto,
  ): Promise<void> {
    return this.pollsService.completePoll({ ...dto, pollId });
  }

  @Delete(':pollId')
  deletePoll(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { pollId }: PollIdDto,
  ): Promise<void> {
    return this.pollsService.deletePoll({ pollId, myId, hasRole });
  }

  @Post(':pollId/votes')
  votePoll(
    @MyId() myId: number,
    @Param() { pollId }: PollIdDto,
    @Body() dto: VotePollDto,
  ): Promise<void> {
    return this.pollsService.votePoll({ ...dto, pollId, myId });
  }
}
