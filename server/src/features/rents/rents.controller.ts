import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RentsService } from './rents.service';
import { Rent } from './rent.entity';
import { CreateRentDto } from './rent.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('rents')
@Controller('rents')
export class RentsController {
  constructor(private rentsService: RentsService) {}

  @Get('my')
  getMyRents(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Rent>> {
    return this.rentsService.getMyRents(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllRents(@Query() req: Request): Promise<Response<Rent>> {
    return this.rentsService.getAllRents(req);
  }

  @Roles(Role.MANAGER)
  @Get('all/select')
  selectAllRents(): Promise<Rent[]> {
    return this.rentsService.selectAllRents();
  }

  @Get('my/select')
  selectMyRents(@MyId() myId: number): Promise<Rent[]> {
    return this.rentsService.selectMyRents(myId);
  }

  @Post()
  createRent(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Body() dto: CreateRentDto,
  ): Promise<void> {
    return this.rentsService.createRent({ ...dto, myId, hasRole });
  }
}
