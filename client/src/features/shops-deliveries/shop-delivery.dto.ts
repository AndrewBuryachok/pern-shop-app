import {
  CreateHaulageDto,
  EditHaulageDto,
  RateHaulageDto,
  TakeHaulageDto,
} from '../haulages/haulage.dto';

export interface CreateShopDeliveryDto extends CreateHaulageDto {
  bargainId: number;
}

export interface EditShopDeliveryDto extends EditHaulageDto {
  shopDeliveryId: number;
}

export interface TakeShopDeliveryDto extends TakeHaulageDto {
  shopDeliveryId: number;
}

export interface ShopDeliveryIdDto {
  shopDeliveryId: number;
}

export interface RateShopDeliveryDto extends RateHaulageDto {
  shopDeliveryId: number;
}
