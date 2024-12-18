import {
  CreateDeliveryDto,
  EditDeliveryDto,
  RateDeliveryDto,
  TakeDeliveryDto,
} from '../deliveries/delivery.dto';

export interface CreateShopDeliveryDto extends CreateDeliveryDto {
  bargainId: number;
}

export interface EditShopDeliveryDto extends EditDeliveryDto {
  shopDeliveryId: number;
}

export interface TakeShopDeliveryDto extends TakeDeliveryDto {
  shopDeliveryId: number;
}

export interface ShopDeliveryIdDto {
  shopDeliveryId: number;
}

export interface RateShopDeliveryDto extends RateDeliveryDto {
  shopDeliveryId: number;
}
