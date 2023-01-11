import { CreatePurchaseDto } from '../purchases/purchase.dto';

export interface CreateSaleDto extends CreatePurchaseDto {
  productId: number;
}
