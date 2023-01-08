import { Controller, Get } from '@nestjs/common';
import { SalesService } from './sales.service';
import { Sale } from './sale.entity';

@Controller('sales')
export class SalesController {
  constructor(private salesService: SalesService) {}

  @Get('my')
  getMySales(myId: number): Promise<Sale[]> {
    return this.salesService.getMySales(myId);
  }

  @Get('placed')
  getPlacedSales(myId: number): Promise<Sale[]> {
    return this.salesService.getPlacedSales(myId);
  }

  @Get('all')
  getAllSales(): Promise<Sale[]> {
    return this.salesService.getAllSales();
  }
}
