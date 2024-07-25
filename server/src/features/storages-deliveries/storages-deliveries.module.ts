import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageDelivery } from './storage-delivery.entity';
import { SalesModule } from '../sales/sales.module';
import { HiresModule } from '../hires/hires.module';
import { CardsModule } from '../cards/cards.module';
import { PaymentsModule } from '../payments/payments.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { StoragesDeliveriesController } from './storages-deliveries.controller';
import { StoragesDeliveriesService } from './storages-deliveries.service';
import { IsStorageDeliveryExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageDelivery]),
    forwardRef(() => SalesModule),
    HiresModule,
    CardsModule,
    PaymentsModule,
    MqttModule,
  ],
  controllers: [StoragesDeliveriesController],
  providers: [StoragesDeliveriesService, IsStorageDeliveryExists],
  exports: [StoragesDeliveriesService],
})
export class StoragesDeliveriesModule {}
