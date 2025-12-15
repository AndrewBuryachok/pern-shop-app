import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Database } from '../../database.enum';
import { Purchase } from './purchase.entity';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { GoodsModule } from '../goods/goods.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import { IsPurchaseExists } from '../../common/constraints';

@Module({
  imports: [
    ...Object.values(Database).map((db) =>
      TypeOrmModule.forFeature([Purchase], db),
    ),
    forwardRef(() => DeliveriesModule),
    GoodsModule,
    MqttModule,
  ],
  controllers: [PurchasesController],
  providers: [PurchasesService, IsPurchaseExists],
  exports: [PurchasesService],
})
export class PurchasesModule {}
