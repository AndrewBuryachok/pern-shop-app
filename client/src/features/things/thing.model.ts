export interface SmThingWithoutPrice {
  id: number;
  item: number;
  description: string;
  intake: number;
  kit: number;
}

export interface SmThing extends SmThingWithoutPrice {
  price: number;
}

export interface MdThing extends SmThing {
  amount: number;
}

export interface LgThing extends MdThing {
  createdAt: Date;
  completedAt?: Date;
}
