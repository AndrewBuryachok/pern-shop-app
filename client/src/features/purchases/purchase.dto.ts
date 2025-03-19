export interface CreatePurchaseDto {
  goodId: number;
  cardId: number;
  amount: number;
  rate: number;
  stationId: number;
  price: number;
}

export interface PurchaseIdDto {
  purchaseId: number;
}
