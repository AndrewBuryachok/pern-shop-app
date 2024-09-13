import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './poll.entity';
import { PollView } from './poll-view.entity';
import { Vote } from './vote.entity';
import { Discussion } from './discussion.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { PollsController } from './polls.controller';
import { DiscussionsController } from './discussions.controller';
import { PollsService } from './polls.service';
import { DiscussionsService } from './discussions.service';
import { IsDiscussionExists, IsPollExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Poll, PollView, Vote, Discussion]),
    MqttModule,
  ],
  controllers: [PollsController, DiscussionsController],
  providers: [
    PollsService,
    DiscussionsService,
    IsPollExists,
    IsDiscussionExists,
  ],
})
export class PollsModule {}
