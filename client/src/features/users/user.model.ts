import { MdCity } from '../cities/city.model';

export interface SmUser {
  id: number;
  nick: string;
  avatar: string;
}

export interface MdUser extends SmUser {
  roles: number[];
}

export interface User extends MdUser {
  createdAt: Date;
  onlineAt?: Date;
  city?: MdCity;
}

export interface ExtUser extends User {
  discord: string;
  background: number;
  friends: SmUser[];
  subscribers: SmUser[];
  raters: SmUser[];
  rating: number;
  waresCount: number;
  productsCount: number;
  ordersCount: number;
  deliveriesCount: number;
  waresRate: number;
  productsRate: number;
  ordersRate: number;
  deliveriesRate: number;
}
