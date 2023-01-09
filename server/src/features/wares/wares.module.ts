import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ware } from './ware.entity';
import { RentsModule } from '../rents/rents.module';
import { PaymentsModule } from '../payments/payments.module';
import { WaresController } from './wares.controller';
import { WaresService } from './wares.service';
import { IsWareExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Ware]), RentsModule, PaymentsModule],
  controllers: [WaresController],
  providers: [WaresService, IsWareExists],
  exports: [WaresService],
})
export class WaresModule {}
