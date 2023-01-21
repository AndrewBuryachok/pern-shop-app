export interface SmThing {
  id: number;
  item: number;
}

export interface MdThing extends SmThing {
  description: string;
  intake: number;
  kit: number;
  price: number;
}

export interface LgThing extends MdThing {
  amount: number;
  createdAt: Date;
}
