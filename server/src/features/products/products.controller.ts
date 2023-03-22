import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './product.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Public()
  @Get('stats')
  getProductsStats(): Promise<Stats> {
    return this.productsService.getProductsStats();
  }

  @Public()
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
