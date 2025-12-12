export interface CreatePlaceDto {
  name: string;
  description: string;
  x: number;
  y: number;
}

export interface CreatePlaceWithCardDto extends CreatePlaceDto {
  cardId: number;
}
