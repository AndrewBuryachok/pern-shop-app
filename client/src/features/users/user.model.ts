import { MdTown } from '../towns/town.model';

export interface SmUser {
  id: number;
  nick: string;
  avatar: string;
}

export interface TwitchUser extends SmUser {
  twitch: string;
}

export interface MdUser extends SmUser {
  roles: string[];
}

export interface User extends MdUser {
  createdAt: Date;
  onlineAt?: Date;
  town?: MdTown;
  time: number;
}

export interface ExtUser extends User {
  time: number;
  background: number;
  discord: string;
  twitch: string;
  youtube: string;
  friends: SmUser[];
  goodsCount: number;
  purchasesCount: number;
  ordersCount: number;
  deliveriesCount: number;
  goodsRate: number;
  purchasesRate: number;
  ordersRate: number;
  deliveriesRate: number;
}
