import { CreatePurchaseDto, RatePurchaseDto } from '../purchases/purchase.dto';

export interface CreateSaleDto extends CreatePurchaseDto {
  productId: number;
}

export interface RateSaleDto extends RatePurchaseDto {
  saleId: number;
}
