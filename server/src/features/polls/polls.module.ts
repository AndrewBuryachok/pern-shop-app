import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './poll.entity';
import { Vote } from './vote.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { IsPollExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, Vote]), MqttModule],
  controllers: [PollsController],
  providers: [PollsService, IsPollExists],
})
export class PollsModule {}
