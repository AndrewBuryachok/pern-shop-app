import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DrawersService } from './drawers.service';
import { Drawer } from './drawer.entity';
import { Station } from '../stations/station.entity';
import { DrawerIdDto, CreateDrawerDto } from './drawer.dto';
import { StationIdDto } from '../stations/station.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('drawers')
@Controller('drawers')
export class DrawersController {
  constructor(private drawersService: DrawersService) {}

  @Public()
  @Get()
  getMainDrawers(@Query() req: Request): Promise<Response<Drawer>> {
    return this.drawersService.getMainDrawers(req);
  }

  @Get('my')
  getMyDrawers(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Drawer>> {
    return this.drawersService.getMyDrawers(myId, req);
  }

  @Roles(Role.MERCHANT)
  @Get('all')
  getAllDrawers(@Query() req: Request): Promise<Response<Drawer>> {
    return this.drawersService.getAllDrawers(req);
  }

  @Public()
  @Get(':stationId/select')
  selectStationDrawers(
    @Param() { stationId }: StationIdDto,
  ): Promise<Drawer[]> {
    return this.drawersService.selectStationDrawers(stationId);
  }

  @Public()
  @Get(':drawerId/station')
  selectDrawerStation(@Param() { drawerId }: DrawerIdDto): Promise<Station> {
    return this.drawersService.selectDrawerStation(drawerId);
  }

  @Post()
  createDrawer(
    @MyId() myId: number,
    @HasRole(Role.MERCHANT) hasRole: boolean,
    @Body() dto: CreateDrawerDto,
  ): Promise<void> {
    return this.drawersService.createDrawer({ ...dto, myId, hasRole });
  }
}
