import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from './store.entity';
import { MarketsTagsModule } from '../markets-tags/markets-tags.module';
import { PaymentsModule } from '../payments/payments.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { IsStoreExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Store]),
    MarketsTagsModule,
    PaymentsModule,
    MqttModule,
  ],
  controllers: [StoresController],
  providers: [StoresService, IsStoreExists],
  exports: [StoresService],
})
export class StoresModule {}
