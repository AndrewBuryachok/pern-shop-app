import { Controller, Get } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { City } from './city.entity';

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
}
