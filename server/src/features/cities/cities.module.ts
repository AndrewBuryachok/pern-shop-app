import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './city.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { IsCityExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([City]), MqttModule],
  controllers: [CitiesController],
  providers: [CitiesService, IsCityExists],
})
export class CitiesModule {}
