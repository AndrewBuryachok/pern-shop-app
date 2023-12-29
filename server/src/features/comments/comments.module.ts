import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { ArticlesModule } from '../articles/articles.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { IsCommentExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), ArticlesModule, MqttModule],
  controllers: [CommentsController],
  providers: [CommentsService, IsCommentExists],
})
export class CommentsModule {}
