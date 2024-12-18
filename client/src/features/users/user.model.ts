import { MdTown } from '../towns/town.model';

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
  town?: MdTown;
  time?: number;
  friendsCount?: number;
  subscribersCount?: number;
  ratersCount?: number;
}

export interface ExtUser extends User {
  time: number;
  background: number;
  discord: string;
  twitch: string;
  youtube: string;
  friends: SmUser[];
  subscribers: SmUser[];
  raters: SmUser[];
  rating: number;
  articles: number;
  articlesLikes: number;
  polls: number;
  pollsLikes: number;
  waresCount: number;
  productsCount: number;
  ordersCount: number;
  haulagesCount: number;
  waresRate: number;
  productsRate: number;
  ordersRate: number;
  haulagesRate: number;
}
