import { CreateThingDto } from '../things/thing.dto';
import { EditStateDto } from '../states/state.dto';

export interface CreateGoodDto extends CreateThingDto {
  shopId: number;
}

export interface EditGoodDto extends CreateThingDto {
  goodId: number;
}

export interface UpdateGoodDto extends EditStateDto {
  goodId: number;
}

export interface GoodIdDto {
  goodId: number;
}
