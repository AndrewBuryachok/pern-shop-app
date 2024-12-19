import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from './box.entity';
import { StationsModule } from '../stations/stations.module';
import { PaymentsModule } from '../payments/payments.module';
import { BoxesController } from './boxes.controller';
import { BoxesService } from './boxes.service';
import { IsBoxExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Box]), StationsModule, PaymentsModule],
  controllers: [BoxesController],
  providers: [BoxesService, IsBoxExists],
  exports: [BoxesService],
})
export class BoxesModule {}
