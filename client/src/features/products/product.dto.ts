import { CreateThingWithAmountDto } from '../things/thing.dto';

export interface CreateProductDto extends CreateThingWithAmountDto {
  storageId: number;
  cardId: number;
}
