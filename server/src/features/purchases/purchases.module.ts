import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Purchase } from './purchase.entity';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { GoodsModule } from '../goods/goods.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { IsPurchaseExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Purchase]),
    forwardRef(() => DeliveriesModule),
    GoodsModule,
    MqttModule,
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService, IsPurchaseExists],
  exports: [PurchasesService],
})
export class PurchasesModule {}
