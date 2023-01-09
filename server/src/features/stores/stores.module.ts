import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { MarketsModule } from '../markets/markets.module';
import { PaymentsModule } from '../payments/payments.module';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { IsStoreExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Store]), MarketsModule, PaymentsModule],
  controllers: [StoresController],
  providers: [StoresService, IsStoreExists],
  exports: [StoresService],
})
export class StoresModule {}
