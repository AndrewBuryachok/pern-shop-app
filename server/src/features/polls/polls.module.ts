import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './poll.entity';
import { PollView } from './poll-view.entity';
import { Vote } from './vote.entity';
import { PollComment } from './comment.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { PollsController } from './polls.controller';
import { CommentsController } from './comments.controller';
import { PollsService } from './polls.service';
import { CommentsService } from './comments.service';
import { IsPollCommentExists, IsPollExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Poll, PollView, Vote, PollComment]),
    MqttModule,
  ],
  controllers: [PollsController, CommentsController],
  providers: [PollsService, CommentsService, IsPollExists, IsPollCommentExists],
})
export class PollsModule {}
