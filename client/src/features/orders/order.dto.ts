import {
  CompleteTransportationDto,
  CreateTransportationDto,
  EditTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export interface CreateOrderDto extends CreateTransportationDto {
  item: string;
  description: string;
  amount: number;
  intake: number;
  kit: number;
}

export interface EditOrderDto extends EditTransportationDto {
  orderId: number;
  item: string;
  description: string;
  amount: number;
  intake: number;
  kit: number;
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
