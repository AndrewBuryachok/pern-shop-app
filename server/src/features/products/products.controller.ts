import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getMainProducts(): Promise<Product[]> {
    return this.productsService.getMainProducts();
  }

  @Get('my')
  getMyProducts(myId: number): Promise<Product[]> {
    return this.productsService.getMyProducts(myId);
  }

  @Get('placed')
  getPlacedProducts(myId: number): Promise<Product[]> {
    return this.productsService.getPlacedProducts(myId);
  }

  @Get('all')
  getAllProducts(): Promise<Product[]> {
    return this.productsService.getAllProducts();
  }
}
