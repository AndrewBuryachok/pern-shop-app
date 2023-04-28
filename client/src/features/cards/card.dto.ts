export interface CreateCardDto {
  name: string;
  color: number;
}

export interface EditCardDto extends CreateCardDto {
  cardId: number;
}

export interface UpdateCardUserDto {
  cardId: number;
  userId: number;
}
