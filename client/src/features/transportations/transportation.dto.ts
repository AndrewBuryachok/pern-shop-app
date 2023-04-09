import { CreateThingDto } from '../things/thing.dto';

export interface CreateTransportationDto extends CreateThingDto {
  cardId: number;
}

export interface TakeTransportationDto {
  cardId: number;
}
