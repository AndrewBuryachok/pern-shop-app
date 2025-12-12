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
import {
  CreateStationDto,
  EditStationDto,
  ExtCreateStationDto,
  StationIdDto,
} from './station.dto';
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
  @Get('all/select')
  selectAllStations(): Promise<Station[]> {
    return this.stationsService.selectAllStations();
  }

  @Post()
  createMyStation(
    @MyId() myId: number,
    @Body() dto: CreateStationDto,
  ): Promise<void> {
    return this.stationsService.createStation({ ...dto, userId: myId });
  }

  @Roles(Role.MODER)
  @Post('all')
  createUserStation(@Body() dto: ExtCreateStationDto): Promise<void> {
    return this.stationsService.createStation(dto);
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
