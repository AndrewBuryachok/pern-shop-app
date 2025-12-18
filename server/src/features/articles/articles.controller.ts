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

  @Roles(Role.MODER)
  @Get('all')
  getAllArticles(@Query() req: Request): Promise<Response<Article>> {
    return this.articlesService.getAllArticles(req);
  }

  @Get('auth/select')
  selectAuthArticles(
    @MyId() myId: number,
  ): Promise<{ view: number[]; up: number[]; down: number[] }> {
    return this.articlesService.selectAuthArticles(myId);
  }

  @Public()
  @Get(':articleId/views')
  selectArticleViews(@Param() { articleId }: ArticleIdDto): Promise<View[]> {
    return this.articlesService.selectArticleViews(articleId);
  }

  @Public()
  @Get(':articleId/likes')
  selectArticleLikes(@Param() { articleId }: ArticleIdDto): Promise<Like[]> {
    return this.articlesService.selectArticleLikes(articleId);
  }

  @Post()
  createMyArticle(
    @MyId() myId: number,
    @Body() dto: CreateArticleDto,
  ): Promise<void> {
    return this.articlesService.createArticle({ ...dto, userId: myId });
  }

  @Roles(Role.MODER)
  @Post('all')
  createUserArticle(@Body() dto: ExtCreateArticleDto): Promise<void> {
    return this.articlesService.createArticle(dto);
  }

  @Patch(':articleId')
  editArticle(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
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
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { articleId }: ArticleIdDto,
  ): Promise<void> {
    return this.articlesService.deleteArticle({ articleId, myId, hasRole });
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
    @Param() { articleId }: ArticleIdDto,
    @Body() dto: LikeArticleDto,
  ): Promise<void> {
    return this.articlesService.likeArticle({ ...dto, articleId, myId });
  }
}
