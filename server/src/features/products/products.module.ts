import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CellsModule } from '../cells/cells.module';
import { PaymentsModule } from '../payments/payments.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { IsProductExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CellsModule, PaymentsModule],
  controllers: [ProductsController],
  providers: [ProductsService, IsProductExists],
  exports: [ProductsService],
})
export class ProductsModule {}
