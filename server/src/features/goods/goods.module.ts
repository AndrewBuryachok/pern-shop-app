import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Good } from './good.entity';
import { GoodState } from './good-state.entity';
import { ShopsModule } from '../shops/shops.module';
import { RentsModule } from '../rents/rents.module';
import { LeasesModule } from '../leases/leases.module';
import { PaymentsModule } from '../payments/payments.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { GoodsController } from './goods.controller';
import { GoodsService } from './goods.service';
import { IsGoodExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Good, GoodState]),
    ShopsModule,
    RentsModule,
    LeasesModule,
    PaymentsModule,
    MqttModule,
  ],
  controllers: [GoodsController],
  providers: [GoodsService, IsGoodExists],
  exports: [GoodsService],
})
export class GoodsModule {}
