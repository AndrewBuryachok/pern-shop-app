import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductState } from './product-state.entity';
import { LeasesModule } from '../leases/leases.module';
import { PaymentsModule } from '../payments/payments.module';
import { MqttModule } from '../mqtt/mqtt.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { IsProductExists } from '../../common/constraints';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductState]),
    LeasesModule,
    PaymentsModule,
    MqttModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, IsProductExists],
  exports: [ProductsService],
})
export class ProductsModule {}
