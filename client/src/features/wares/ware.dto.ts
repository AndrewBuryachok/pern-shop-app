import { CreateThingDto } from '../things/thing.dto';
import { EditStateDto } from '../states/state.dto';

export interface CreateWareDto extends CreateThingDto {
  rentId: number;
}

export interface EditWareDto extends EditStateDto {
  wareId: number;
}
