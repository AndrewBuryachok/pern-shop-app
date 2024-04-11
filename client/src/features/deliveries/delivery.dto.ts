import {
  CreateTransportationDto,
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export interface CreateDeliveryDto extends CreateTransportationDto {
  fromStorageTagId: number;
  toStorageTagId: number;
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
