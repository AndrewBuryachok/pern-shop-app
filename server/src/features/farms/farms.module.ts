import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Farm } from './farm.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { FarmsController } from './farms.controller';
import { FarmsService } from './farms.service';
import { IsFarmExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Farm]), MqttModule],
  controllers: [FarmsController],
  providers: [FarmsService, IsFarmExists],
  exports: [FarmsService],
})
export class FarmsModule {}
