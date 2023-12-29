import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Market } from './market.entity';
import { MarketState } from './market-state.entity';
import { CardsModule } from '../cards/cards.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { MarketsController } from './markets.controller';
import { MarketsService } from './markets.service';
import { IsMarketExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Market, MarketState]),
    CardsModule,
    MqttModule,
  ],
  controllers: [MarketsController],
  providers: [MarketsService, IsMarketExists],
  exports: [MarketsService],
})
export class MarketsModule {}
