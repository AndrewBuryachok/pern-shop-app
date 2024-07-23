import {
  CreatePlaceWithPriceDto,
  EditPlaceWithPriceDto,
} from '../places/place.dto';

export interface CreateStationDto extends CreatePlaceWithPriceDto {}

export interface EditStationDto extends EditPlaceWithPriceDto {
  stationId: number;
}
