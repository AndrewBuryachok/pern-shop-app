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
import { ArticlesService } from './articles.service';
import { Article } from './article.entity';
import { View } from './view.entity';
import { Like } from './like.entity';
import {
  ArticleIdDto,
  CreateArticleDto,
  EditArticleDto,
  ExtCreateArticleDto,
  LikeArticleDto,
} from './article.dto';
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags(':project/articles')
@Controller(':project/articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Public()
  @Get()
  getMainArticles(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Article>> {
    return this.articlesService.getMainArticles(project, req);
  }

  @Get('my')
  getMyArticles(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Article>> {
    return this.articlesService.getMyArticles(project, myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllArticles(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Article>> {
    return this.articlesService.getAllArticles(project, req);
  }

  @Get('auth/select')
  selectAuthArticles(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
  ): Promise<{ view: number[]; up: number[]; down: number[] }> {
    return this.articlesService.selectAuthArticles(project, myId);
  }

  @Public()
  @Get(':articleId/views')
  selectArticleViews(
    @Param() { project }: ProjectDto,
    @Param() { articleId }: ArticleIdDto,
  ): Promise<View[]> {
    return this.articlesService.selectArticleViews(project, articleId);
  }

  @Public()
  @Get(':articleId/likes')
  selectArticleLikes(
    @Param() { project }: ProjectDto,
    @Param() { articleId }: ArticleIdDto,
  ): Promise<Like[]> {
    return this.articlesService.selectArticleLikes(project, articleId);
  }

  @Post()
  createMyArticle(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Body() dto: CreateArticleDto,
  ): Promise<void> {
    return this.articlesService.createArticle(project, {
      ...dto,
      userId: myId,
    });
  }

  @Roles(Role.MODER)
  @Post('all')
  createUserArticle(
    @Param() { project }: ProjectDto,
    @Body() dto: ExtCreateArticleDto,
  ): Promise<void> {
    return this.articlesService.createArticle(project, dto);
  }

  @Patch(':articleId')
  editArticle(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { articleId }: ArticleIdDto,
    @Body() dto: EditArticleDto,
  ): Promise<void> {
    return this.articlesService.editArticle(project, {
      ...dto,
      articleId,
      myId,
      hasRole,
    });
  }

  @Delete(':articleId')
  deleteArticle(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { articleId }: ArticleIdDto,
  ): Promise<void> {
    return this.articlesService.deleteArticle(project, {
      articleId,
      myId,
      hasRole,
    });
  }

  @Post(':articleId/views')
  viewArticle(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { articleId }: ArticleIdDto,
  ): Promise<void> {
    return this.articlesService.viewArticle(project, { articleId, myId });
  }

  @Post(':articleId/likes')
  likeArticle(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Param() { articleId }: ArticleIdDto,
    @Body() dto: LikeArticleDto,
  ): Promise<void> {
    return this.articlesService.likeArticle(project, {
      ...dto,
      articleId,
      myId,
    });
  }
}
