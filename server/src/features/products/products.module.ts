import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { LeasesModule } from '../leases/leases.module';
import { PaymentsModule } from '../payments/payments.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { IsProductExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), LeasesModule, PaymentsModule],
  controllers: [ProductsController],
  providers: [ProductsService, IsProductExists],
  exports: [ProductsService],
})
export class ProductsModule {}
