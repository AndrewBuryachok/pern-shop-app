export interface CreatePlaceDto {
  name: string;
  image: string;
  description: string;
  x: number;
  y: number;
}

export interface CreatePlaceWithPriceDto extends CreatePlaceDto {
  price: number;
}

export interface CreatePlaceWithCardDto extends CreatePlaceWithPriceDto {
  cardId: number;
}
