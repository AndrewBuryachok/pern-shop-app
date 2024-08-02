export interface CreateExchangeDto {
  cardId: number;
  type: boolean;
  sum: number;
}

export interface DeleteExchangeDto {
  exchangeId: number;
}
