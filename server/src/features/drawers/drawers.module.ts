import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Drawer } from './drawer.entity';
import { StationsModule } from '../stations/stations.module';
import { PaymentsModule } from '../payments/payments.module';
import { DrawersController } from './drawers.controller';
import { DrawersService } from './drawers.service';
import { IsDrawerExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Drawer]), StationsModule, PaymentsModule],
  controllers: [DrawersController],
  providers: [DrawersService, IsDrawerExists],
  exports: [DrawersService],
})
export class DrawersModule {}
