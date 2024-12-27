export interface CreatePurchaseDto {
  goodId: number;
  cardId: number;
  amount: number;
  stationId: number;
  price: number;
}

export interface PurchaseIdDto {
  purchaseId: number;
}

export interface RatePurchaseDto extends PurchaseIdDto {
  rate: number;
}
