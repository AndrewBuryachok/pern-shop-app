export abstract class Thing {
  id: number;
  item: number;
  description: string;
  price: number;
  createdAt: Date;
}

export abstract class ThingWithAmount extends Thing {
  amountNow: number;
  amountAll: number;
  intake: number;
  kit: number;
}
