import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Advert } from './advert.entity';
import { Task } from '../tasks/task.entity';
import { CardsModule } from '../cards/cards.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { AdvertsController } from './adverts.controller';
import { AdvertsService } from './adverts.service';
import { IsAdvertExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Advert, Task]), CardsModule, MqttModule],
  controllers: [AdvertsController],
  providers: [AdvertsService, IsAdvertExists],
})
export class AdvertsModule {}
