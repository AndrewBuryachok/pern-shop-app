import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hire } from './hire.entity';
import { BoxesModule } from '../boxes/boxes.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { HiresController } from './hires.controller';
import { HiresService } from './hires.service';
import { IsHireExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Hire]), BoxesModule, MqttModule],
  controllers: [HiresController],
  providers: [HiresService, IsHireExists],
  exports: [HiresService],
})
export class HiresModule {}
