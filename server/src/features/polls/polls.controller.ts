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
import { PollView } from './poll-view.entity';
import { PollLike } from './poll-like.entity';
import {
  CompletePollDto,
  CreatePollDto,
  EditPollDto,
  ExtCreatePollDto,
  LikePollDto,
  PollIdDto,
} from './poll.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
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

  @Get('liked')
  getLikedPolls(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Poll>> {
    return this.pollsService.getLikedPolls(myId, req);
  }

  @Get('commented')
  getCommentedPolls(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Poll>> {
    return this.pollsService.getCommentedPolls(myId, req);
  }

  @Roles(Role.INSPECTOR)
  @Get('all')
  getAllPolls(@Query() req: Request): Promise<Response<Poll>> {
    return this.pollsService.getAllPolls(req);
  }

  @Get('viewed/select')
  selectViewedPolls(@MyId() myId: number): Promise<number[]> {
    return this.pollsService.selectViewedPolls(myId);
  }

  @Get('liked/select')
  selectLikedPolls(
    @MyId() myId: number,
  ): Promise<{ up: number[]; down: number[] }> {
    return this.pollsService.selectLikedPolls(myId);
  }

  @Public()
  @Get(':pollId/views')
  selectPollViews(@Param() { pollId }: PollIdDto): Promise<PollView[]> {
    return this.pollsService.selectPollViews(pollId);
  }

  @Public()
  @Get(':pollId/likes')
  selectPollUpLikes(@Param() { pollId }: PollIdDto): Promise<PollLike[]> {
    return this.pollsService.selectPollLikes(pollId);
  }

  @Post()
  createMyPoll(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreatePollDto,
  ): Promise<void> {
    return this.pollsService.createPoll({ ...dto, userId: myId, nick });
  }

  @Roles(Role.INSPECTOR)
  @Post('all')
  createUserPoll(
    @MyNick() nick: string,
    @Body() dto: ExtCreatePollDto,
  ): Promise<void> {
    return this.pollsService.createPoll({ ...dto, nick });
  }

  @Patch(':pollId')
  editPoll(
    @MyId() myId: number,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { pollId }: PollIdDto,
    @Body() dto: EditPollDto,
  ): Promise<void> {
    return this.pollsService.editPoll({ ...dto, pollId, myId, hasRole });
  }

  @Roles(Role.INSPECTOR)
  @Post(':pollId')
  completePoll(
    @MyNick() nick: string,
    @Param() { pollId }: PollIdDto,
    @Body() dto: CompletePollDto,
  ): Promise<void> {
    return this.pollsService.completePoll({ ...dto, pollId, nick });
  }

  @Delete(':pollId')
  deletePoll(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { pollId }: PollIdDto,
  ): Promise<void> {
    return this.pollsService.deletePoll({ pollId, myId, nick, hasRole });
  }

  @Post(':pollId/views')
  viewPoll(
    @MyId() myId: number,
    @Param() { pollId }: PollIdDto,
  ): Promise<void> {
    return this.pollsService.viewPoll({ pollId, myId });
  }

  @Post(':pollId/likes')
  likePoll(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { pollId }: PollIdDto,
    @Body() dto: LikePollDto,
  ): Promise<void> {
    return this.pollsService.likePoll({ ...dto, pollId, myId, nick });
  }
}
