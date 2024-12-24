import { EditStateDto } from '../states/state.dto';
import {
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export interface CreateDeliveryDto extends EditStateDto {
  stationId: number;
  cardId: number;
}

export interface CreateShopDeliveryDto extends CreateDeliveryDto {
  bargainId: number;
}

export interface CreateMarketDeliveryDto extends CreateDeliveryDto {
  tradeId: number;
}

export interface CreateStorageDeliveryDto extends CreateDeliveryDto {
  saleId: number;
}

export type CreateAnyDeliveryDto = CreateShopDeliveryDto &
  CreateMarketDeliveryDto &
  CreateStorageDeliveryDto;

export interface EditDeliveryDto extends EditStateDto {
  deliveryId: number;
}

export interface TakeDeliveryDto extends TakeTransportationDto {
  deliveryId: number;
}

export interface DeliveryIdDto {
  deliveryId: number;
}

export interface RateDeliveryDto extends RateTransportationDto {
  deliveryId: number;
}
