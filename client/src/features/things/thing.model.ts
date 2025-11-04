export interface SmThingWithoutPrice {
  id: number;
  item: string;
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
}
