import { Controller, Get } from '@nestjs/common';
import { LeasesService } from './leases.service';
import { Product } from '../products/product.entity';

@Controller('leases')
export class LeasesController {
  constructor(private leasesService: LeasesService) {}

  @Get('my')
  getMyLeases(myId: number): Promise<Product[]> {
    return this.leasesService.getMyLeases(myId);
  }

  @Get('all')
  getAllLeases(): Promise<Product[]> {
    return this.leasesService.getAllLeases();
  }
}
