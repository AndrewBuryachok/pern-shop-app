import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LotsService } from './lots.service';
import { Lot } from './lot.entity';
import { CreateLotDto, LotIdDto } from './lot.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('lots')
@Controller('lots')
export class LotsController {
  constructor(private lotsService: LotsService) {}

  @Public()
  @Get()
  getMainLots(@Query() req: Request): Promise<Response<Lot>> {
    return this.lotsService.getMainLots(req);
  }

  @Get('my')
  getMyLots(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Lot>> {
    return this.lotsService.getMyLots(myId, req);
  }

  @Get('placed')
  getPlacedLots(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Lot>> {
    return this.lotsService.getPlacedLots(myId, req);
  }

  @Roles(Role.MANAGER)
  @Get('all')
  getAllLots(@Query() req: Request): Promise<Response<Lot>> {
    return this.lotsService.getAllLots(req);
  }

  @Post()
  createLot(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Body() dto: CreateLotDto,
  ): Promise<void> {
    return this.lotsService.createLot({ ...dto, myId, hasRole });
  }

  @Post(':lotId')
  completeLot(
    @MyId() myId: number,
    @HasRole(Role.MANAGER) hasRole: boolean,
    @Param() { lotId }: LotIdDto,
  ): Promise<void> {
    return this.lotsService.completeLot({ lotId, myId, hasRole });
  }
}
