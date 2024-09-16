import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticleView } from './article-view.entity';
import { Like } from './like.entity';
import { ArticleComment } from './comment.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { ArticlesController } from './articles.controller';
import { CommentsController } from './comments.controller';
import { ArticlesService } from './articles.service';
import { CommentsService } from './comments.service';
import {
  IsArticleCommentExists,
  IsArticleExists,
} from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article, ArticleView, Like, ArticleComment]),
    MqttModule,
  ],
  controllers: [ArticlesController, CommentsController],
  providers: [
    ArticlesService,
    CommentsService,
    IsArticleExists,
    IsArticleCommentExists,
  ],
})
export class ArticlesModule {}
