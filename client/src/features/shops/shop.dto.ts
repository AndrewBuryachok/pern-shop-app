import { CreatePlaceDto } from '../places/place.dto';

export interface CreateShopDto extends CreatePlaceDto {}

export interface ExtCreateShopDto extends CreateShopDto {
  userId: number;
}

export interface EditShopDto extends CreatePlaceDto {
  shopId: number;
}

export interface UpdateShopUserDto {
  shopId: number;
  userId: number;
}
