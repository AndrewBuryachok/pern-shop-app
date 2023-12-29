import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Card } from './card.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { IsCardExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Card]), MqttModule],
  controllers: [CardsController],
  providers: [CardsService, IsCardExists],
  exports: [CardsService],
})
export class CardsModule {}
