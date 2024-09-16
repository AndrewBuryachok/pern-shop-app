import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { PollComment } from './comment.entity';
import { CommentIdDto, CreateCommentDto, EditCommentDto } from './comment.dto';
import { PollIdDto } from './poll.dto';
import { HasRole, MyId, MyNick, Public } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('polls-comments')
@Controller('polls-comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Public()
  @Get(':pollId')
  selectPollComments(@Param() { pollId }: PollIdDto): Promise<PollComment[]> {
    return this.commentsService.selectPollComments(pollId);
  }

  @Post()
  createComment(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateCommentDto,
  ): Promise<void> {
    return this.commentsService.createComment({ ...dto, myId, nick });
  }

  @Patch(':commentId')
  editComment(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { commentId }: CommentIdDto,
    @Body() dto: EditCommentDto,
  ): Promise<void> {
    return this.commentsService.editComment({
      ...dto,
      commentId,
      myId,
      nick,
      hasRole,
    });
  }

  @Delete(':commentId')
  deleteComment(
    @MyId() myId: number,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { commentId }: CommentIdDto,
  ): Promise<void> {
    return this.commentsService.deleteComment({
      commentId,
      myId,
      hasRole,
    });
  }
}
