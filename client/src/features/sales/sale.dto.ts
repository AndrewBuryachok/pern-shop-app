import {
  CreatePurchaseWithAmountDto,
  RatePurchaseDto,
} from '../purchases/purchase.dto';

export interface CreateSaleDto extends CreatePurchaseWithAmountDto {
  productId: number;
}

export interface RateSaleDto extends RatePurchaseDto {
  saleId: number;
}
