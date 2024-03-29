import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { WaresModule } from '../wares/wares.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { IsTradeExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Trade]), WaresModule, MqttModule],
  controllers: [TradesController],
  providers: [TradesService, IsTradeExists],
})
export class TradesModule {}
