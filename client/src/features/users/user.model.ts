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
  background: number;
  discord: string;
  twitch: string;
  youtube: string;
  friends: SmUser[];
  subscribers: SmUser[];
  raters: SmUser[];
  rating: number;
  articles: number;
  likes: number;
  comments: number;
  tasks: number;
  plaints: number;
  polls: number;
  votes: number;
  discussions: number;
  waresCount: number;
  productsCount: number;
  ordersCount: number;
  deliveriesCount: number;
  waresRate: number;
  productsRate: number;
  ordersRate: number;
  deliveriesRate: number;
}
