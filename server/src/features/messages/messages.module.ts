import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { IsMessageExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), MqttModule],
  controllers: [MessagesController],
  providers: [MessagesService, IsMessageExists],
})
export class MessagesModule {}
