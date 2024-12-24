import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { WaresModule } from '../wares/wares.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { IsTradeExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trade]),
    forwardRef(() => DeliveriesModule),
    WaresModule,
    MqttModule,
  ],
  controllers: [TradesController],
  providers: [TradesService, IsTradeExists],
  exports: [TradesService],
})
export class TradesModule {}
