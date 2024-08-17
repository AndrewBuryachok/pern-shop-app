export interface EditServiceDto {
  activity: string;
  text: string;
  price: number;
}

export interface CreateServiceDto extends EditServiceDto {
  cardId: number;
}
