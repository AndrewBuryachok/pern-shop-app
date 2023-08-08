import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SalesService } from './sales.service';
import { Sale } from './sale.entity';
import { CreateSaleDto, RateSaleDto, SaleIdDto } from './sale.dto';
import { Request, Response, Stats } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('sales')
@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Public()
  @Get('stats')
  getSalesStats(): Promise<Stats> {
    return this.salesService.getSalesStats();
  }

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
  createSale(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Body() dto: CreateSaleDto,
  ): Promise<void> {
    return this.salesService.createSale({ ...dto, myId, hasRole });
  }

  @Post(':saleId/rate')
  rateSale(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { saleId }: SaleIdDto,
    @Body() dto: RateSaleDto,
  ): Promise<void> {
    return this.salesService.rateSale({ ...dto, saleId, myId, hasRole });
  }
}
