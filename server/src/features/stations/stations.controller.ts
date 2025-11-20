import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StationsService } from './stations.service';
import { Station } from './station.entity';
import { StationState } from './station-state.entity';
import { CreateStationDto, EditStationDto, StationIdDto } from './station.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('stations')
@Controller('stations')
export class StationsController {
  constructor(private stationsService: StationsService) {}

  @Public()
  @Get()
  getMainStations(@Query() req: Request): Promise<Response<Station>> {
    return this.stationsService.getMainStations(req);
  }

  @Get('my')
  getMyStations(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Station>> {
    return this.stationsService.getMyStations(myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllStations(@Query() req: Request): Promise<Response<Station>> {
    return this.stationsService.getAllStations(req);
  }

  @Public()
  @Get('main/select')
  selectMainStations(): Promise<Station[]> {
    return this.stationsService.selectMainStations();
  }

  @Get('my/select')
  selectMyStations(@MyId() myId: number): Promise<Station[]> {
    return this.stationsService.selectMyStations(myId);
  }

  @Roles(Role.MODER)
  @Get('all/select')
  selectAllStations(): Promise<Station[]> {
    return this.stationsService.selectAllStations();
  }

  @Public()
  @Get('free/select')
  selectFreeStations(): Promise<Station[]> {
    return this.stationsService.selectFreeStations();
  }

  @Public()
  @Get(':stationId/states')
  selectStationStates(
    @Param() { stationId }: StationIdDto,
  ): Promise<StationState[]> {
    return this.stationsService.selectStationStates(stationId);
  }

  @Post()
  createStation(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Body() dto: CreateStationDto,
  ): Promise<void> {
    return this.stationsService.createStation({ ...dto, myId, hasRole });
  }

  @Patch(':stationId')
  editStation(
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { stationId }: StationIdDto,
    @Body() dto: EditStationDto,
  ): Promise<void> {
    return this.stationsService.editStation({
      ...dto,
      stationId,
      myId,
      hasRole,
    });
  }
}
