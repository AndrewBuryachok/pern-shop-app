import { CreateThingDto } from '../things/thing.dto';

export interface CreateGoodDto extends CreateThingDto {
  shopId: number;
}

export interface EditGoodDto extends CreateThingDto {
  goodId: number;
}

export interface DeleteGoodDto {
  goodId: number;
}
