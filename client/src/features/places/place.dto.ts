export interface CreatePlaceDto {
  name: string;
  description: string;
  x: number;
  y: number;
}

export interface CreatePlaceWithCardDto extends CreatePlaceDto {
  cardId: number;
}

export interface CreatePlaceWithPriceDto extends CreatePlaceWithCardDto {
  price: number;
}

export interface EditPlaceWithPriceDto extends CreatePlaceDto {
  price: number;
}
