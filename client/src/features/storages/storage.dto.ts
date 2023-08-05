import {
  CreatePlaceWithCardDto,
  CreatePlaceWithPriceDto,
} from '../places/place.dto';

export interface CreateStorageDto extends CreatePlaceWithCardDto {}

export interface EditStorageDto extends CreatePlaceWithPriceDto {
  storageId: number;
}
