import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './product.dto';

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

  @Post()
  createProduct(myId: number, @Body() dto: CreateProductDto): Promise<void> {
    return this.productsService.createProduct({ ...dto, myId });
  }
}
