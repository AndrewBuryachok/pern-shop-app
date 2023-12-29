import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './article.entity';
import { Like } from './like.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { IsArticleExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Like]), MqttModule],
  controllers: [ArticlesController],
  providers: [ArticlesService, IsArticleExists],
  exports: [ArticlesService],
})
export class ArticlesModule {}
