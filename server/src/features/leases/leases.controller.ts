import { Controller, Get } from '@nestjs/common';
import { LeasesService } from './leases.service';
import { Product } from '../products/product.entity';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@Controller('leases')
export class LeasesController {
  constructor(private leasesService: LeasesService) {}

  @Get('my')
  getMyLeases(@MyId() myId: number): Promise<Product[]> {
    return this.leasesService.getMyLeases(myId);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllLeases(): Promise<Product[]> {
    return this.leasesService.getAllLeases();
  }
}
