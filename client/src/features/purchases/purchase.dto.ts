export interface CreatePurchaseDto {
  cardId: number;
  amount: number;
  stationId: number;
  price: number;
}

export interface CreateShopPurchaseDto extends CreatePurchaseDto {
  goodId: number;
}

export interface CreateMarketPurchaseDto extends CreatePurchaseDto {
  wareId: number;
}

export interface CreateStoragePurchaseDto extends CreatePurchaseDto {
  productId: number;
}

export type CreateAnyPurchaseDto = CreateShopPurchaseDto &
  CreateMarketPurchaseDto &
  CreateStoragePurchaseDto;

export interface PurchaseIdDto {
  purchaseId: number;
}

export interface RatePurchaseDto extends PurchaseIdDto {
  rate: number;
}
