import {
  CreateTransportationDto,
  RateTransportationDto,
  TakeTransportationDto,
} from '../transportations/transportation.dto';
import { CreateThingDto } from '../things/thing.dto';

export interface CreateHaulageDto extends CreateTransportationDto {
  fromStationId: number;
  toStationId: number;
}

export interface EditHaulageDto extends CreateThingDto {
  haulageId: number;
}

export interface TakeHaulageDto extends TakeTransportationDto {
  haulageId: number;
}

export interface HaulageIdDto {
  haulageId: number;
}

export interface RateHaulageDto extends RateTransportationDto {
  haulageId: number;
}
