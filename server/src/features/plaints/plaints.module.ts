import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Plaint } from './plaint.entity';
import { MqttModule } from '../mqtt/mqtt.module';
import { PlaintsController } from './plaints.controller';
import { PlaintsService } from './plaints.service';
import { IsPlaintExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Plaint]), MqttModule],
  controllers: [PlaintsController],
  providers: [PlaintsService, IsPlaintExists],
  exports: [PlaintsService],
})
export class PlaintsModule {}
