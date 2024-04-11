import { CreateThingDto } from '../things/thing.dto';

export interface CreateLotDto extends CreateThingDto {
  storageTagId: number;
  cardId: number;
}

export interface CompleteLotDto {
  lotId: number;
}
