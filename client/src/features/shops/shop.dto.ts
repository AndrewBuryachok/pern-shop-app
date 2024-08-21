import { CreatePlaceDto, CreatePlaceWithCardDto } from '../places/place.dto';

export interface CreateShopDto extends CreatePlaceWithCardDto {}

export interface EditShopDto extends CreatePlaceDto {
  shopId: number;
}
