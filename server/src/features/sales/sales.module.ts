import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sale } from './sale.entity';
import { ProductsModule } from '../products/products.module';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { IsSaleExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Sale]), ProductsModule],
  controllers: [SalesController],
  providers: [SalesService, IsSaleExists],
})
export class SalesModule {}
