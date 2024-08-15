import { CreatePlaceDto } from '../places/place.dto';

export interface CreateFarmDto extends CreatePlaceDto {}

export interface ExtCreateFarmDto extends CreateFarmDto {
  userId: number;
}

export interface EditFarmDto extends CreatePlaceDto {
  farmId: number;
}

export interface UpdateFarmUserDto {
  farmId: number;
  userId: number;
}
