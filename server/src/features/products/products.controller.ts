import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './product.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  getMainProducts(@Query() req: Request): Promise<Response<Product>> {
    return this.productsService.getMainProducts(req);
  }

  @Get('my')
  getMyProducts(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Product>> {
    return this.productsService.getMyProducts(myId, req);
  }

  @Get('placed')
  getPlacedProducts(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Product>> {
    return this.productsService.getPlacedProducts(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllProducts(@Query() req: Request): Promise<Response<Product>> {
    return this.productsService.getAllProducts(req);
  }

  @Post()
  createProduct(
    @MyId() myId: number,
    @Body() dto: CreateProductDto,
  ): Promise<void> {
    return this.productsService.createProduct({ ...dto, myId });
  }
}
