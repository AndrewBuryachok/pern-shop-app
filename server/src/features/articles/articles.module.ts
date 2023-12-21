import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { Like } from './like.entity';
import { IsArticleExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Like])],
  controllers: [ArticlesController],
  providers: [ArticlesService, IsArticleExists],
})
export class ArticlesModule {}
