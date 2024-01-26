import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PollsService } from './polls.service';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';
import { Discussion } from '../discussions/discussion.entity';
import {
  CompletePollDto,
  CreatePollDto,
  EditPollDto,
  ExtCreatePollDto,
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

  @Get('voted/select')
  selectVotedPolls(@MyId() myId: number): Promise<Poll[]> {
    return this.pollsService.selectVotedPolls(myId);
  }

  @Public()
  @Get(':pollId/votes')
  selectPollVotes(@Param() { pollId }: PollIdDto): Promise<Vote[]> {
    return this.pollsService.selectPollVotes(pollId);
  }

  @Public()
  @Get(':pollId/discussions')
  selectPollDiscussions(@Param() { pollId }: PollIdDto): Promise<Discussion[]> {
    return this.pollsService.selectPollDiscussions(pollId);
  }

  @Post()
  createMyPoll(
    @MyId() myId: number,
    @Body() dto: CreatePollDto,
  ): Promise<void> {
    return this.pollsService.createPoll({ ...dto, userId: myId });
  }

  @Roles(Role.ADMIN)
  @Post('all')
  createUserPoll(@Body() dto: ExtCreatePollDto): Promise<void> {
    return this.pollsService.createPoll(dto);
  }

  @Patch(':pollId')
  editPoll(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { pollId }: PollIdDto,
    @Body() dto: EditPollDto,
  ): Promise<void> {
    return this.pollsService.editPoll({ ...dto, pollId, myId, hasRole });
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
