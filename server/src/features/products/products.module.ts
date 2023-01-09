import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { IsProductExists } from '../../common/constraints';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService, IsProductExists],
})
export class ProductsModule {}
