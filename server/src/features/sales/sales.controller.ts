import { Body, Controller, Get, Post } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sale } from './sale.entity';
import { CreateSaleDto } from './sale.dto';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get('my')
  getMySales(@MyId() myId: number): Promise<Sale[]> {
    return this.salesService.getMySales(myId);
  }

  @Get('placed')
  getPlacedSales(@MyId() myId: number): Promise<Sale[]> {
    return this.salesService.getPlacedSales(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllSales(): Promise<Sale[]> {
    return this.salesService.getAllSales();
  }

  @Post()
  createSale(@MyId() myId: number, @Body() dto: CreateSaleDto): Promise<void> {
    return this.salesService.createSale({ ...dto, myId });
  }
}
