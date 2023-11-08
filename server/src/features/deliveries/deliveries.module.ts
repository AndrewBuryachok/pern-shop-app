import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './delivery.entity';
import { LeasesModule } from '../leases/leases.module';
import { CardsModule } from '../cards/cards.module';
import { PaymentsModule } from '../payments/payments.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { IsDeliveryExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Delivery]),
    LeasesModule,
    CardsModule,
    PaymentsModule,
    MqttModule,
  ],
  controllers: [DeliveriesController],
  providers: [DeliveriesService, IsDeliveryExists],
  exports: [DeliveriesService],
})
export class DeliveriesModule {}
