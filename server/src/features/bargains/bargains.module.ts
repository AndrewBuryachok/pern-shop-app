import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bargain } from './bargain.entity';
import { ShopsDeliveriesModule } from '../shops-deliveries/shops-deliveries.module';
import { GoodsModule } from '../goods/goods.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { BargainsController } from './bargains.controller';
import { BargainsService } from './bargains.service';
import { IsBargainExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bargain]),
    forwardRef(() => ShopsDeliveriesModule),
    GoodsModule,
    MqttModule,
  ],
  controllers: [BargainsController],
  providers: [BargainsService, IsBargainExists],
  exports: [BargainsService],
})
export class BargainsModule {}
