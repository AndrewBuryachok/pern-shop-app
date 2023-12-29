import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './shop.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { ShopsController } from './shops.controller';
import { ShopsService } from './shops.service';
import { IsShopExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Shop]), MqttModule],
  controllers: [ShopsController],
  providers: [ShopsService, IsShopExists],
  exports: [ShopsService],
})
export class ShopsModule {}
