export interface SmThing {
  id: number;
  item: number;
  description: string;
}

export interface MdThing extends SmThing {
  intake: number;
  kit: number;
  price: number;
}

export interface LgThing extends MdThing {
  amount: number;
  createdAt: Date;
  completedAt?: Date;
}
