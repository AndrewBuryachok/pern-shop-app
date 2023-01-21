import { CreateThingDto } from '../things/thing.dto';

export interface CreateWareDto extends CreateThingDto {
  rentId: number;
}
