import {
  CreateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export interface CreateDeliveryDto extends CreateTransportationDto {
  fromStorageId: number;
  toStorageId: number;
  userId: number;
}

export interface TakeDeliveryDto extends TakeTransportationDto {
  deliveryId: number;
}

export interface DeliveryIdDto {
  deliveryId: number;
}
