export interface SmThing {
  id: number;
  item: number;
  description: string;
  intake: number;
  kit: number;
  price: number;
}

export interface MdThing extends SmThing {
  amount: number;
}

export interface LgThing extends MdThing {
  createdAt: Date;
  completedAt?: Date;
}
