import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BoxesService } from './boxes.service';
import { Box } from './box.entity';
import { Station } from '../stations/station.entity';
import { BoxIdDto, CreateBoxDto } from './box.dto';
import { StationIdDto } from '../stations/station.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('boxes')
@Controller('boxes')
export class BoxesController {
  constructor(private boxesService: BoxesService) {}

  @Public()
  @Get()
  getMainBoxes(@Query() req: Request): Promise<Response<Box>> {
    return this.boxesService.getMainBoxes(req);
  }

  @Get('my')
  getMyBoxes(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Box>> {
    return this.boxesService.getMyBoxes(myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllBoxes(@Query() req: Request): Promise<Response<Box>> {
    return this.boxesService.getAllBoxes(req);
  }

  @Public()
  @Get(':stationId/select')
  selectStationBoxes(@Param() { stationId }: StationIdDto): Promise<Box[]> {
    return this.boxesService.selectStationBoxes(stationId);
  }

  @Public()
  @Get(':boxId/station')
  selectBoxStation(@Param() { boxId }: BoxIdDto): Promise<Station> {
    return this.boxesService.selectBoxStation(boxId);
  }

  @Post()
  createBox(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Body() dto: CreateBoxDto,
  ): Promise<void> {
    return this.boxesService.createBox({ ...dto, myId, hasRole });
  }
}
