import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './sale.entity';
import { DeliveriesModule } from '../deliveries/deliveries.module';
import { ProductsModule } from '../products/products.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { IsSaleExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale]),
    forwardRef(() => DeliveriesModule),
    ProductsModule,
    MqttModule,
  ],
  controllers: [SalesController],
  providers: [SalesService, IsSaleExists],
  exports: [SalesService],
})
export class SalesModule {}
