import { MdCity } from '../cities/city.model';
import { SmCard } from '../cards/card.model';

export interface SmUser {
  id: number;
  name: string;
}

export interface SmUserWithCity extends SmUser {
  cityId?: number;
}

export interface MdUser extends SmUser {
  roles: number[];
}

export interface User extends MdUser {
  registeredAt: Date;
  city?: MdCity;
  cards: SmCard[];
}

export interface ExtUser extends User {
  goods: number;
  wares: number;
  products: number;
  orders: number;
  deliveries: number;
  tradesRate: number;
  salesRate: number;
  ordersRate: number;
  deliveriesRate: number;
  friends: SmUser[];
  rating: number;
}
