import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Poll } from './poll.entity';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { IsPollExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Poll])],
  controllers: [PollsController],
  providers: [PollsService, IsPollExists],
})
export class PollsModule {}
