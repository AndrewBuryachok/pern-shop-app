import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exchange } from './exchange.entity';
import { CardsModule } from '../cards/cards.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { ExchangesController } from './exchanges.controller';
import { ExchangesService } from './exchanges.service';

@Module({
  imports: [TypeOrmModule.forFeature([Exchange]), CardsModule, MqttModule],
  controllers: [ExchangesController],
  providers: [ExchangesService],
})
export class ExchangesModule {}
