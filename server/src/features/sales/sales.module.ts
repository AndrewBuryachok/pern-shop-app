import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './sale.entity';
import { StoragesDeliveriesModule } from '../storages-deliveries/storages-deliveries.module';
import { ProductsModule } from '../products/products.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { IsSaleExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale]),
    forwardRef(() => StoragesDeliveriesModule),
    ProductsModule,
    MqttModule,
  ],
  controllers: [SalesController],
  providers: [SalesService, IsSaleExists],
  exports: [SalesService],
})
export class SalesModule {}
