import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './delivery.entity';
import { BargainsModule } from '../bargains/bargains.module';
import { TradesModule } from '../trades/trades.module';
import { SalesModule } from '../sales/sales.module';
import { HiresModule } from '../hires/hires.module';
import { CardsModule } from '../cards/cards.module';
import { PaymentsModule } from '../payments/payments.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { IsDeliveryExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery]),
    forwardRef(() => BargainsModule),
    forwardRef(() => TradesModule),
    forwardRef(() => SalesModule),
    HiresModule,
    CardsModule,
    PaymentsModule,
    MqttModule,
  ],
  controllers: [DeliveriesController],
  providers: [DeliveriesService, IsDeliveryExists],
  exports: [DeliveriesService],
})
export class DeliveriesModule {}
