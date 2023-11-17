import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LeasesService } from './leases.service';
import { Lease } from './lease.entity';
import { LeaseIdDto } from './lease.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('leases')
@Controller('leases')
export class LeasesController {
  constructor(private leasesService: LeasesService) {}

  @Get('my')
  getMyLeases(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Lease>> {
    return this.leasesService.getMyLeases(myId, req);
  }

  @Get('placed')
  getPlacedLeases(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Lease>> {
    return this.leasesService.getPlacedLeases(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllLeases(@Query() req: Request): Promise<Response<Lease>> {
    return this.leasesService.getAllLeases(req);
  }

  @Post(':leaseId')
  completeLease(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { leaseId }: LeaseIdDto,
  ): Promise<void> {
    return this.leasesService.completeLease({ leaseId, myId, hasRole });
  }
}
