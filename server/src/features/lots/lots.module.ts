import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './lot.entity';
import { LeasesModule } from '../leases/leases.module';
import { PaymentsModule } from '../payments/payments.module';
import { LotsController } from './lots.controller';
import { LotsService } from './lots.service';
import { IsLotExists } from '../../common/constraints';
import { CardsModule } from '../cards/cards.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot]),
    LeasesModule,
    CardsModule,
    PaymentsModule,
  ],
  controllers: [LotsController],
  providers: [LotsService, IsLotExists],
  exports: [LotsService],
})
export class LotsModule {}
