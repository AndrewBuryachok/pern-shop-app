import { EditStateDto } from '../states/state.dto';

export interface EditDeliveryDto extends EditStateDto {}

export interface CreateDeliveryDto extends EditDeliveryDto {
  stationId: number;
  cardId: number;
}

export interface TakeDeliveryDto {
  cardId: number;
}

export interface RateDeliveryDto {
  rate: number;
}
