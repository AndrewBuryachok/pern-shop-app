export interface CreatePurchaseDto {
  cardId: number;
}

export interface CreatePurchaseWithAmountDto extends CreatePurchaseDto {
  amount: number;
}

export interface CreatePurchaseWithPriceDto extends CreatePurchaseDto {
  price: number;
}

export interface RatePurchaseDto {
  rate: number;
}
