export interface EditTransportationDto {
  sum: number;
}

export interface CreateTransportationDto extends EditTransportationDto {
  stationId: number;
  cardId: number;
}

export interface TakeTransportationDto {
  cardId: number;
}

export interface CompleteTransportationDto {
  rate: number;
}
