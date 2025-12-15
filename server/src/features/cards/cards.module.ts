import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../../database.enum';
import { Account } from './account.entity';
import { Card } from './card.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { IsCardExists } from '../../common/constraints';

@Module({
  imports: [
    ...Object.values(Database).map((db) =>
      TypeOrmModule.forFeature([Account, Card], db),
    ),
    MqttModule,
  ],
  controllers: [CardsController],
  providers: [CardsService, IsCardExists],
  exports: [CardsService],
})
export class CardsModule {}
