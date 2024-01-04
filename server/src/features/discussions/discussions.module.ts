import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Discussion } from './discussion.entity';
import { PollsModule } from '../polls/polls.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { DiscussionsController } from './discussions.controller';
import { DiscussionsService } from './discussions.service';
import { IsDiscussionExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Discussion]), PollsModule, MqttModule],
  controllers: [DiscussionsController],
  providers: [DiscussionsService, IsDiscussionExists],
})
export class DiscussionsModule {}
