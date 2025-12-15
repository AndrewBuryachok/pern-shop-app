import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../../database.enum';
import { Message } from './message.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { IsMessageExists } from '../../common/constraints';

@Module({
  imports: [
    ...Object.values(Database).map((db) =>
      TypeOrmModule.forFeature([Message], db),
    ),
    MqttModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, IsMessageExists],
})
export class MessagesModule {}
