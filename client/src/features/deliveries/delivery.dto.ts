import {
  CreateTransportationDto,
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';
import { CreateThingDto } from '../things/thing.dto';

export interface CreateDeliveryDto extends CreateTransportationDto {
  fromStationId: number;
  toStationId: number;
}

export interface EditDeliveryDto extends CreateThingDto {
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
