import { CreateThingWithAmountDto } from '../things/thing.dto';

export interface CreateWareDto extends CreateThingWithAmountDto {
  rentId: number;
}
