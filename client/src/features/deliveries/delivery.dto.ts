import { EditStateDto } from '../states/state.dto';
import {
  CompleteTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';

export interface CreateDeliveryDto extends EditStateDto {
  purchaseId: number;
  stationId: number;
  cardId: number;
}

export interface EditDeliveryDto extends EditStateDto {
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
