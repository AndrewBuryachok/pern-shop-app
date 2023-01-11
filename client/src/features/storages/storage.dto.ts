import { CreatePlaceDto, CreatePlaceWithCardDto } from '../places/place.dto';

export interface CreateStorageDto extends CreatePlaceWithCardDto {}

export interface EditStorageDto extends CreatePlaceDto {
  storageId: number;
}
