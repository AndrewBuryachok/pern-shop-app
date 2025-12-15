import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../../database.enum';
import { Shop } from './shop.entity';
import { CardsModule } from '../cards/cards.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { ShopsController } from './shops.controller';
import { ShopsService } from './shops.service';
import { IsShopExists } from '../../common/constraints';

@Module({
  imports: [
    ...Object.values(Database).map((db) =>
      TypeOrmModule.forFeature([Shop], db),
    ),
    CardsModule,
    MqttModule,
  ],
  controllers: [ShopsController],
  providers: [ShopsService, IsShopExists],
  exports: [ShopsService],
})
export class ShopsModule {}
