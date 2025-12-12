import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Station } from './station.entity';
import { StationState } from './station-state.entity';
import { CardsModule } from '../cards/cards.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { IsStationExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Station, StationState]),
    CardsModule,
    MqttModule,
  ],
  controllers: [StationsController],
  providers: [StationsService, IsStationExists],
})
export class StationsModule {}
