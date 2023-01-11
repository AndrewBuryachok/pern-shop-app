export interface Thing {
  id: number;
  item: number;
}

export interface ThingWithPrice extends Thing {
  description: string;
  price: number;
}

export interface ThingWithKit extends ThingWithPrice {
  intake: number;
  kit: number;
}

export interface ThingWithAmount extends ThingWithKit {
  amountNow: number;
  amountAll: number;
  createdAt: Date;
}
