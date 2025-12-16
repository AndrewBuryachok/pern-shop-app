import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../../database.enum';
import { Station } from './station.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { IsStationExists } from '../../common/constraints';

@Module({
  imports: [
    ...Object.values(Database).map((db) =>
      TypeOrmModule.forFeature([Station], db),
    ),
    MqttModule,
  ],
  controllers: [StationsController],
  providers: [StationsService, IsStationExists],
  exports: [StationsService],
})
export class StationsModule {}
