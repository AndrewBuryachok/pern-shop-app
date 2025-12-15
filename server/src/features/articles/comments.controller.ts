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
import { Comment } from './comment.entity';
import { CommentIdDto, CreateCommentDto, EditCommentDto } from './comment.dto';
import { ArticleIdDto } from './article.dto';
import { ProjectDto } from '../../project.dto';
import { HasRole, MyId, Public } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags(':project/comments')
@Controller(':project/comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Public()
  @Get(':articleId')
  selectArticleComments(
    @Param() { project }: ProjectDto,
    @Param() { articleId }: ArticleIdDto,
  ): Promise<Comment[]> {
    return this.commentsService.selectArticleComments(project, articleId);
  }

  @Post()
  createComment(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Body() dto: CreateCommentDto,
  ): Promise<void> {
    return this.commentsService.createComment(project, { ...dto, myId });
  }

  @Patch(':commentId')
  editComment(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { commentId }: CommentIdDto,
    @Body() dto: EditCommentDto,
  ): Promise<void> {
    return this.commentsService.editComment(project, {
      ...dto,
      commentId,
      myId,
      hasRole,
    });
  }

  @Delete(':commentId')
  deleteComment(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { commentId }: CommentIdDto,
  ): Promise<void> {
    return this.commentsService.deleteComment(project, {
      commentId,
      myId,
      hasRole,
    });
  }
}
