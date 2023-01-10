import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LeasesService } from './leases.service';
import { Product } from '../products/product.entity';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('leases')
@Controller('leases')
export class LeasesController {
  constructor(private leasesService: LeasesService) {}

  @Get('my')
  getMyLeases(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Product>> {
    return this.leasesService.getMyLeases(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllLeases(@Query() req: Request): Promise<Response<Product>> {
    return this.leasesService.getAllLeases(req);
  }
}
