import { CreateThingDto } from '../things/thing.dto';
import { EditStateDto } from '../states/state.dto';

export interface CreateProductDto extends CreateThingDto {
  storageId: number;
  cardId: number;
}

export interface EditProductDto extends EditStateDto {
  productId: number;
}

export interface CompleteProductDto {
  productId: number;
}
