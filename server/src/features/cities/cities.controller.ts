import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { City } from './city.entity';
import { CityIdDto, CreateCityDto, EditCityDto } from './city.dto';

@Controller('cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Get()
  getMainCities(): Promise<City[]> {
    return this.citiesService.getMainCities();
  }

  @Get('my')
  getMyCities(myId: number): Promise<City[]> {
    return this.citiesService.getMyCities(myId);
  }

  @Get('all')
  getAllCities(): Promise<City[]> {
    return this.citiesService.getAllCities();
  }

  @Get('my/select')
  selectMyCities(myId: number): Promise<City[]> {
    return this.citiesService.selectMyCities(myId);
  }

  @Post()
  createCity(myId: number, @Body() dto: CreateCityDto): Promise<void> {
    return this.citiesService.createCity({ ...dto, myId });
  }

  @Patch(':cityId')
  editCity(
    myId: number,
    @Param() { cityId }: CityIdDto,
    @Body() dto: EditCityDto,
  ): Promise<void> {
    return this.citiesService.editCity({ ...dto, cityId, myId });
  }
}
