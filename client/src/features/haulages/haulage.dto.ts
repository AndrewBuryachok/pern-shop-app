export interface TakeHaulageDto {
  cardId: number;
}

export interface CreateHaulageDto extends TakeHaulageDto {
  stationId: number;
  price: number;
}

export interface RateHaulageDto {
  rate: number;
}
