import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopDelivery } from './shop-delivery.entity';
import { BargainsModule } from '../bargains/bargains.module';
import { HiresModule } from '../hires/hires.module';
import { CardsModule } from '../cards/cards.module';
import { PaymentsModule } from '../payments/payments.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { ShopsDeliveriesController } from './shops-deliveries.controller';
import { ShopsDeliveriesService } from './shops-deliveries.service';
import { IsShopDeliveryExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopDelivery]),
    forwardRef(() => BargainsModule),
    HiresModule,
    CardsModule,
    PaymentsModule,
    MqttModule,
  ],
  controllers: [ShopsDeliveriesController],
  providers: [ShopsDeliveriesService, IsShopDeliveryExists],
  exports: [ShopsDeliveriesService],
})
export class ShopsDeliveriesModule {}
