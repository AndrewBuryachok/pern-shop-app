import { CreatePlaceDto } from '../places/place.dto';

export interface CreateCityDto extends CreatePlaceDto {}

export interface EditCityDto extends CreatePlaceDto {
  cityId: number;
}
