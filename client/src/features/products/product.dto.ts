import { CreateThingDto } from '../things/thing.dto';

export interface CreateProductDto extends CreateThingDto {
  storageId: number;
  cardId: number;
}
