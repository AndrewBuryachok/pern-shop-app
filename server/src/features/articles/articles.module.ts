import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../../database.enum';
import { Article } from './article.entity';
import { View } from './view.entity';
import { Like } from './like.entity';
import { Comment } from './comment.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { ArticlesController } from './articles.controller';
import { CommentsController } from './comments.controller';
import { ArticlesService } from './articles.service';
import { CommentsService } from './comments.service';
import { IsArticleExists, IsCommentExists } from '../../common/constraints';

@Module({
  imports: [
    ...Object.values(Database).map((db) =>
      TypeOrmModule.forFeature([Article, View, Like, Comment], db),
    ),
    MqttModule,
  ],
  controllers: [ArticlesController, CommentsController],
  providers: [
    ArticlesService,
    CommentsService,
    IsArticleExists,
    IsCommentExists,
  ],
})
export class ArticlesModule {}
