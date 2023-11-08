import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';
import { PollsModule } from '../polls/polls.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vote]), PollsModule, MqttModule],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}
