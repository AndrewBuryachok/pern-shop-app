import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MarketDelivery } from './market-delivery.entity';
import { TradesModule } from '../trades/trades.module';
import { HiresModule } from '../hires/hires.module';
import { CardsModule } from '../cards/cards.module';
import { PaymentsModule } from '../payments/payments.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { MarketsDeliveriesController } from './markets-deliveries.controller';
import { MarketsDeliveriesService } from './markets-deliveries.service';
import { IsMarketDeliveryExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([MarketDelivery]),
    forwardRef(() => TradesModule),
    HiresModule,
    CardsModule,
    PaymentsModule,
    MqttModule,
  ],
  controllers: [MarketsDeliveriesController],
  providers: [MarketsDeliveriesService, IsMarketDeliveryExists],
  exports: [MarketsDeliveriesService],
})
export class MarketsDeliveriesModule {}
