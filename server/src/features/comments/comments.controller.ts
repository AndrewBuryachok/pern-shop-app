import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CommentIdDto, CreateCommentDto, EditCommentDto } from './comment.dto';
import { HasRole, MyId, MyNick } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

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
    @HasRole(Role.ADMIN) hasRole: boolean,
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
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { commentId }: CommentIdDto,
  ): Promise<void> {
    return this.commentsService.deleteComment({ commentId, myId, hasRole });
  }
}
