import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HiresService } from './hires.service';
import { Hire } from './hire.entity';
import { Thing } from '../things/thing.entity';
import { HireIdDto } from './hire.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('hires')
@Controller('hires')
export class HiresController {
  constructor(private hiresService: HiresService) {}

  @Public()
  @Get('notifications')
  getHiresNotifications(): Promise<number[]> {
    return this.hiresService.getHiresNotifications();
  }

  @Public()
  @Get()
  getMainHires(@Query() req: Request): Promise<Response<Hire>> {
    return this.hiresService.getMainHires(req);
  }

  @Get('my')
  getMyHires(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Hire>> {
    return this.hiresService.getMyHires(myId, req);
  }

  @Get('received')
  getReceivedHires(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Hire>> {
    return this.hiresService.getReceivedHires(myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllHires(@Query() req: Request): Promise<Response<Hire>> {
    return this.hiresService.getAllHires(req);
  }

  @Public()
  @Get(':hireId/things')
  selectHireThings(@Param() { hireId }: HireIdDto): Promise<Thing[]> {
    return this.hiresService.selectHireThings(hireId);
  }

  @Post(':hireId/continue')
  continueHire(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { hireId }: HireIdDto,
  ): Promise<void> {
    return this.hiresService.continueHire({ hireId, myId, hasRole });
  }

  @Post(':hireId')
  completeHire(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { hireId }: HireIdDto,
  ): Promise<void> {
    return this.hiresService.completeHire({ hireId, myId, hasRole });
  }
}
