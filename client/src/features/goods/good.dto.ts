import { CreateThingDto } from '../things/thing.dto';
import { EditStateDto } from '../states/state.dto';

export interface CreateGoodDto extends CreateThingDto {
  shopId: number;
}

export interface EditGoodDto extends EditStateDto {
  goodId: number;
}

export interface CompleteGoodDto {
  goodId: number;
}
