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
import { ArticleComment } from './comment.entity';
import { CommentIdDto, CreateCommentDto, EditCommentDto } from './comment.dto';
import { ArticleIdDto } from './article.dto';
import { HasRole, MyId, MyNick, Public } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('articles-comments')
@Controller('articles-comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Public()
  @Get(':articleId')
  selectArticleComments(
    @Param() { articleId }: ArticleIdDto,
  ): Promise<ArticleComment[]> {
    return this.commentsService.selectArticleComments(articleId);
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
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { commentId }: CommentIdDto,
    @Body() dto: EditCommentDto,
  ): Promise<void> {
    return this.commentsService.editComment({
      ...dto,
      commentId,
      myId,
      hasRole,
    });
  }

  @Delete(':commentId')
  deleteComment(
    @MyId() myId: number,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { commentId }: CommentIdDto,
  ): Promise<void> {
    return this.commentsService.deleteComment({ commentId, myId, hasRole });
  }
}
