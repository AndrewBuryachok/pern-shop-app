import { EditStateDto } from '../states/state.dto';

export interface EditHaulageDto extends EditStateDto {}

export interface CreateHaulageDto extends EditHaulageDto {
  stationId: number;
  cardId: number;
}

export interface TakeHaulageDto {
  cardId: number;
}

export interface RateHaulageDto {
  rate: number;
}
