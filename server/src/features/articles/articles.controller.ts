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
import { ArticleIdDto, CreateArticleDto, EditArticleDto } from './article.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
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

  @Roles(Role.ADMIN)
  @Get('all')
  getAllArticles(@Query() req: Request): Promise<Response<Article>> {
    return this.articlesService.getAllArticles(req);
  }

  @Post()
  createArticle(
    @MyId() myId: number,
    @Body() dto: CreateArticleDto,
  ): Promise<void> {
    return this.articlesService.createArticle({ ...dto, myId });
  }

  @Patch(':articleId')
  editArticle(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
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
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { articleId }: ArticleIdDto,
  ): Promise<void> {
    return this.articlesService.deleteArticle({ articleId, myId, hasRole });
  }

  @Post(':articleId/likes')
  likeArticle(
    @MyId() myId: number,
    @Param() { articleId }: ArticleIdDto,
  ): Promise<void> {
    return this.articlesService.likeArticle({ articleId, myId });
  }
}
