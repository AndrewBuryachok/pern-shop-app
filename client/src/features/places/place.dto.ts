export interface CreatePlaceDto {
  name: string;
  x: number;
  y: number;
}

export interface CreatePlaceWithPriceDto extends CreatePlaceDto {
  price: number;
}

export interface CreatePlaceWithCardDto extends CreatePlaceWithPriceDto {
  cardId: number;
}
