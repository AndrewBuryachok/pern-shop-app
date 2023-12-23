import { MdCity } from '../cities/city.model';

export interface SmUser {
  id: number;
  nick: string;
}

export interface MdUser extends SmUser {
  roles: number[];
}

export interface User extends MdUser {
  createdAt: Date;
  city?: MdCity;
  friends: SmUser[];
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
