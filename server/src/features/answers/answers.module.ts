import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Answer } from './answer.entity';
import { PlaintsModule } from '../plaints/plaints.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { AnswersController } from './answers.controller';
import { AnswersService } from './answers.service';
import { IsAnswerExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Answer]), PlaintsModule, MqttModule],
  controllers: [AnswersController],
  providers: [AnswersService, IsAnswerExists],
})
export class AnswersModule {}
