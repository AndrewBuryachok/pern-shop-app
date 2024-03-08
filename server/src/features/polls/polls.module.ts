import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './poll.entity';
import { PollView } from './poll-view.entity';
import { Vote } from './vote.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { IsPollExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollView, Vote]), MqttModule],
  controllers: [PollsController],
  providers: [PollsService, IsPollExists],
  exports: [PollsService],
})
export class PollsModule {}
