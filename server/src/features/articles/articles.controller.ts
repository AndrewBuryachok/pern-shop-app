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
import { ArticleView } from './article-view.entity';
import { ArticleLike } from './article-like.entity';
import {
  ArticleIdDto,
  CreateArticleDto,
  EditArticleDto,
  ExtCreateArticleDto,
  LikeArticleDto,
} from './article.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, MyNick, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Public()
  @Get()
  getMainArticles(@Query() req: Request): Promise<Response<Article>> {
    return this.articlesService.getMainArticles(req);
  }

  @Get('my')
  getMyArticles(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Article>> {
    return this.articlesService.getMyArticles(myId, req);
  }

  @Get('subscribed')
  getSubscribedArticles(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Article>> {
    return this.articlesService.getSubscribedArticles(myId, req);
  }

  @Get('liked')
  getLikedArticles(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Article>> {
    return this.articlesService.getLikedArticles(myId, req);
  }

  @Get('commented')
  getCommentedArticles(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Article>> {
    return this.articlesService.getCommentedArticles(myId, req);
  }

  @Roles(Role.INSPECTOR)
  @Get('all')
  getAllArticles(@Query() req: Request): Promise<Response<Article>> {
    return this.articlesService.getAllArticles(req);
  }

  @Get('viewed/select')
  selectViewedArticles(@MyId() myId: number): Promise<number[]> {
    return this.articlesService.selectViewedArticles(myId);
  }

  @Get('liked/select')
  selectLikedArticles(
    @MyId() myId: number,
  ): Promise<{ up: number[]; down: number[] }> {
    return this.articlesService.selectLikedArticles(myId);
  }

  @Public()
  @Get(':articleId/views')
  selectArticleViews(
    @Param() { articleId }: ArticleIdDto,
  ): Promise<ArticleView[]> {
    return this.articlesService.selectArticleViews(articleId);
  }

  @Public()
  @Get(':articleId/likes')
  selectArticleLikes(
    @Param() { articleId }: ArticleIdDto,
  ): Promise<ArticleLike[]> {
    return this.articlesService.selectArticleLikes(articleId);
  }

  @Post()
  createMyArticle(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Body() dto: CreateArticleDto,
  ): Promise<void> {
    return this.articlesService.createArticle({ ...dto, userId: myId, nick });
  }

  @Roles(Role.INSPECTOR)
  @Post('all')
  createUserArticle(
    @MyNick() nick: string,
    @Body() dto: ExtCreateArticleDto,
  ): Promise<void> {
    return this.articlesService.createArticle({ ...dto, nick });
  }

  @Patch(':articleId')
  editArticle(
    @MyId() myId: number,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { articleId }: ArticleIdDto,
    @Body() dto: EditArticleDto,
  ): Promise<void> {
    return this.articlesService.editArticle({
      ...dto,
      articleId,
      myId,
      hasRole,
    });
  }

  @Delete(':articleId')
  deleteArticle(
    @MyId() myId: number,
    @MyNick() nick: string,
    @HasRole(Role.INSPECTOR) hasRole: boolean,
    @Param() { articleId }: ArticleIdDto,
  ): Promise<void> {
    return this.articlesService.deleteArticle({
      articleId,
      myId,
      nick,
      hasRole,
    });
  }

  @Post(':articleId/views')
  viewArticle(
    @MyId() myId: number,
    @Param() { articleId }: ArticleIdDto,
  ): Promise<void> {
    return this.articlesService.viewArticle({ articleId, myId });
  }

  @Post(':articleId/likes')
  likeArticle(
    @MyId() myId: number,
    @MyNick() nick: string,
    @Param() { articleId }: ArticleIdDto,
    @Body() dto: LikeArticleDto,
  ): Promise<void> {
    return this.articlesService.likeArticle({ ...dto, articleId, myId, nick });
  }
}
