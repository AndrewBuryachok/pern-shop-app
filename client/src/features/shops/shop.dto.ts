import { CreatePlaceDto } from '../places/place.dto';

export interface CreateShopDto extends CreatePlaceDto {}

export interface EditShopDto extends CreatePlaceDto {
  shopId: number;
}
