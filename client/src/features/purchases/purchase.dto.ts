export interface CreatePurchaseDto {
  goodId: number;
  cardId: number;
  amount: number;
  rate: number;
  stationId: number;
  sum: number;
}

export interface PurchaseIdDto {
  purchaseId: number;
}
