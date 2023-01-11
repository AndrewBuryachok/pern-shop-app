export interface CreateThingDto {
  item: number;
  description: string;
  price: number;
}

export interface CreateThingWithAmountDto extends CreateThingDto {
  amount: number;
  intake: number;
  kit: number;
}
