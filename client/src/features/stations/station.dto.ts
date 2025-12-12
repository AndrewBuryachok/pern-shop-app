import { CreatePlaceDto } from '../places/place.dto';

export interface CreateStationDto extends CreatePlaceDto {}

export interface ExtCreateStationDto extends CreateStationDto {
  userId: number;
}

export interface EditStationDto extends CreatePlaceDto {
  stationId: number;
}
