import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CitiesService } from './cities.service';
import { City } from './city.entity';
import {
  CityIdDto,
  CreateCityDto,
  EditCityDto,
  ExtCreateCityDto,
  UpdateCityUserDto,
} from './city.dto';
import { Request, Response } from '../../common/interfaces';
import { HasRole, MyId, Public, Roles } from '../../common/decorators';
import { Role } from '../users/role.enum';

@ApiTags('cities')
@Controller('cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Public()
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

  @Public()
  @Get('all/select')
  selectAllCities(): Promise<City[]> {
    return this.citiesService.selectAllCities();
  }

  @Get('my/select')
  selectMyCities(@MyId() myId: number): Promise<City[]> {
    return this.citiesService.selectMyCities(myId);
  }

  @Post()
  createMyCity(
    @MyId() myId: number,
    @Body() dto: CreateCityDto,
  ): Promise<void> {
    return this.citiesService.createCity({ ...dto, userId: myId });
  }

  @Roles(Role.ADMIN)
  @Post('all')
  createUserCity(@Body() dto: ExtCreateCityDto): Promise<void> {
    return this.citiesService.createCity(dto);
  }

  @Patch(':cityId')
  editCity(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { cityId }: CityIdDto,
    @Body() dto: EditCityDto,
  ): Promise<void> {
    return this.citiesService.editCity({ ...dto, cityId, myId, hasRole });
  }

  @Post(':cityId/users')
  addCityUser(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { cityId }: CityIdDto,
    @Body() dto: UpdateCityUserDto,
  ): Promise<void> {
    return this.citiesService.addCityUser({ ...dto, cityId, myId, hasRole });
  }

  @Delete(':cityId/users')
  removeCityUser(
    @MyId() myId: number,
    @HasRole(Role.ADMIN) hasRole: boolean,
    @Param() { cityId }: CityIdDto,
    @Body() dto: UpdateCityUserDto,
  ): Promise<void> {
    return this.citiesService.removeCityUser({ ...dto, cityId, myId, hasRole });
  }
}
