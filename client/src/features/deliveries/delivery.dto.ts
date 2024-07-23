import {
  CreateTransportationDto,
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export interface CreateDeliveryDto extends CreateTransportationDto {
  fromStationId: number;
  toStationId: number;
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
