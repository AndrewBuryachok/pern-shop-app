import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './rent.entity';
import { StoresModule } from '../stores/stores.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { RentsController } from './rents.controller';
import { RentsService } from './rents.service';
import { IsRentExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Rent]), StoresModule, MqttModule],
  controllers: [RentsController],
  providers: [RentsService, IsRentExists],
  exports: [RentsService],
})
export class RentsModule {}
