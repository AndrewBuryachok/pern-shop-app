export interface CreatePlaceDto {
  name: string;
  x: number;
  y: number;
}

export interface CreatePlaceWithCardDto extends CreatePlaceDto {
  cardId: number;
  price: number;
}
