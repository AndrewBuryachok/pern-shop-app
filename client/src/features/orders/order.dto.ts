import {
  CreateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export interface CreateOrderDto extends CreateTransportationDto {
  storageId: number;
}

export interface TakeOrderDto extends TakeTransportationDto {
  orderId: number;
}

export interface OrderIdDto {
  orderId: number;
}
