import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './product.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getMainProducts(): Promise<Product[]> {
    return this.productsService.getMainProducts();
  }

  @Get('my')
  getMyProducts(@MyId() myId: number): Promise<Product[]> {
    return this.productsService.getMyProducts(myId);
  }

  @Get('placed')
  getPlacedProducts(@MyId() myId: number): Promise<Product[]> {
    return this.productsService.getPlacedProducts(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }

  @Post()
  createProduct(
    @MyId() myId: number,
    @Body() dto: CreateProductDto,
  ): Promise<void> {
    return this.productsService.createProduct({ ...dto, myId });
  }
}
