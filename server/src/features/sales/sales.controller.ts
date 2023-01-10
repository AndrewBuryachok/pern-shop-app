import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sale } from './sale.entity';
import { CreateSaleDto } from './sale.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get('my')
  getMySales(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Sale>> {
    return this.salesService.getMySales(myId, req);
  }

  @Get('placed')
  getPlacedSales(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Sale>> {
    return this.salesService.getPlacedSales(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllSales(@Query() req: Request): Promise<Response<Sale>> {
    return this.salesService.getAllSales(req);
  }

  @Post()
  createSale(@MyId() myId: number, @Body() dto: CreateSaleDto): Promise<void> {
    return this.salesService.createSale({ ...dto, myId });
  }
}
