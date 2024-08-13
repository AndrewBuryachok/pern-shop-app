export interface EditServiceDto {
  description: string;
  price: number;
}

export interface CreateServiceDto extends EditServiceDto {
  cardId: number;
}
