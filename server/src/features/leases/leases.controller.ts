import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LeasesService } from './leases.service';
import { Lease } from './lease.entity';
import { Thing } from '../things/thing.entity';
import { LeaseIdDto } from './lease.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('leases')
@Controller('leases')
export class LeasesController {
  constructor(private leasesService: LeasesService) {}

  @Public()
  @Get()
  getMainLeases(@Query() req: Request): Promise<Response<Lease>> {
    return this.leasesService.getMainLeases(req);
  }

  @Get('my')
  getMyLeases(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Lease>> {
    return this.leasesService.getMyLeases(myId, req);
  }

  @Get('received')
  getReceivedLeases(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Lease>> {
    return this.leasesService.getReceivedLeases(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllLeases(@Query() req: Request): Promise<Response<Lease>> {
    return this.leasesService.getAllLeases(req);
  }

  @Public()
  @Get(':leaseId/things')
  selectLeaseThings(@Param() { leaseId }: LeaseIdDto): Promise<Thing[]> {
    return this.leasesService.selectLeaseThings(leaseId);
  }

  @Post(':leaseId/continue')
  continueLease(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { leaseId }: LeaseIdDto,
  ): Promise<void> {
    return this.leasesService.continueLease({ leaseId, myId, hasRole });
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
