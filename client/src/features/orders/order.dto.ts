import {
  CompleteTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';
import { CreateThingDto } from '../things/thing.dto';

export interface CreateOrderDto extends CreateThingDto {
  stationId: number;
  cardId: number;
}

export interface EditOrderDto extends CreateThingDto {
  orderId: number;
}

export interface TakeOrderDto extends TakeTransportationDto {
  orderId: number;
}

export interface OrderIdDto {
  orderId: number;
}

export interface CompleteOrderDto extends CompleteTransportationDto {
  orderId: number;
}
