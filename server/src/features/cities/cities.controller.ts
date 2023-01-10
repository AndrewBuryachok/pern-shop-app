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
import { CitiesService } from './cities.service';
import { City } from './city.entity';
import { CityIdDto, CreateCityDto, EditCityDto } from './city.dto';
import { Request, Response } from '../../common/interfaces';
import { MyId, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('cities')
@Controller('cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Get()
  getMainCities(@Query() req: Request): Promise<Response<City>> {
    return this.citiesService.getMainCities(req);
  }

  @Get('my')
  getMyCities(
    @MyId() myId: number,
    @Query() req: Request,
  ): Promise<Response<City>> {
    return this.citiesService.getMyCities(myId, req);
  }

  @Roles(Role.ADMIN)
  @Get('all')
  getAllCities(@Query() req: Request): Promise<Response<City>> {
    return this.citiesService.getAllCities(req);
  }

  @Get('my/select')
  selectMyCities(@MyId() myId: number): Promise<City[]> {
    return this.citiesService.selectMyCities(myId);
  }

  @Post()
  createCity(@MyId() myId: number, @Body() dto: CreateCityDto): Promise<void> {
    return this.citiesService.createCity({ ...dto, myId });
  }

  @Patch(':cityId')
  editCity(
    @MyId() myId: number,
    @Param() { cityId }: CityIdDto,
    @Body() dto: EditCityDto,
  ): Promise<void> {
    return this.citiesService.editCity({ ...dto, cityId, myId });
  }
}
