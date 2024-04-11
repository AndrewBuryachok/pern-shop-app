import {
  CreateTransportationDto,
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export interface CreateOrderDto extends CreateTransportationDto {
  storageTagId: number;
}

export interface TakeOrderDto extends TakeTransportationDto {
  orderId: number;
}

export interface OrderIdDto {
  orderId: number;
}

export interface RateOrderDto extends RateTransportationDto {
  orderId: number;
}
