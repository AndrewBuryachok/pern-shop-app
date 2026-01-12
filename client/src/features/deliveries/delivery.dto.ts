import {
  CompleteTransportationDto,
  CreateTransportationDto,
  EditTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export interface CreateDeliveryDto extends CreateTransportationDto {
  purchaseId: number;
}

export interface EditDeliveryDto extends EditTransportationDto {
  deliveryId: number;
}

export interface TakeDeliveryDto extends TakeTransportationDto {
  deliveryId: number;
}

export interface DeliveryIdDto {
  deliveryId: number;
}

export interface CompleteDeliveryDto extends CompleteTransportationDto {
  deliveryId: number;
}
