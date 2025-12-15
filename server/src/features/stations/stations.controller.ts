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
import { ProjectDto } from '../../project.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags(':project/stations')
@Controller(':project/stations')
export class StationsController {
  constructor(private stationsService: StationsService) {}

  @Public()
  @Get()
  getMainStations(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Station>> {
    return this.stationsService.getMainStations(project, req);
  }

  @Get('my')
  getMyStations(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<Station>> {
    return this.stationsService.getMyStations(project, myId, req);
  }

  @Roles(Role.MODER)
  @Get('all')
  getAllStations(
    @Param() { project }: ProjectDto,
    @Query() req: Request,
  ): Promise<Response<Station>> {
    return this.stationsService.getAllStations(project, req);
  }

  @Public()
  @Get('all/select')
  selectAllStations(@Param() { project }: ProjectDto): Promise<Station[]> {
    return this.stationsService.selectAllStations(project);
  }

  @Post()
  createMyStation(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @Body() dto: CreateStationDto,
  ): Promise<void> {
    return this.stationsService.createStation(project, {
      ...dto,
      userId: myId,
    });
  }

  @Roles(Role.MODER)
  @Post('all')
  createUserStation(
    @Param() { project }: ProjectDto,
    @Body() dto: ExtCreateStationDto,
  ): Promise<void> {
    return this.stationsService.createStation(project, dto);
  }

  @Patch(':stationId')
  editStation(
    @Param() { project }: ProjectDto,
    @MyId() myId: number,
    @HasRole(Role.MODER) hasRole: boolean,
    @Param() { stationId }: StationIdDto,
    @Body() dto: EditStationDto,
  ): Promise<void> {
    return this.stationsService.editStation(project, {
      ...dto,
      stationId,
      myId,
      hasRole,
    });
  }
}
