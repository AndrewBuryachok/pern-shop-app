import { CreatePlaceDto } from '../places/place.dto';

export interface CreateTownDto extends CreatePlaceDto {}

export interface ExtCreateTownDto extends CreateTownDto {
  userId: number;
}

export interface EditTownDto extends CreatePlaceDto {
  townId: number;
}

export interface UpdateTownUserDto {
  townId: number;
  userId: number;
}
