export interface CreatePurchaseDto {
  cardId: number;
  amount: number;
  stationId: number;
  price: number;
}

export interface RatePurchaseDto {
  rate: number;
}
