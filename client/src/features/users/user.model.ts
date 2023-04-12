import { SmCity } from '../cities/city.model';
import { SmCard } from '../cards/card.model';

export interface SmUser {
  id: number;
  name: string;
  status: boolean;
}

export interface SmUserWithCity extends SmUser {
  cityId?: number;
}

export interface MdUser extends SmUser {
  roles: number[];
}

export interface User extends MdUser {
  city?: SmCity;
  cards: SmCard[];
  friends: SmUser[];
}

export interface ExtUser extends User {
  goods: number;
  wares: number;
  products: number;
  trades: number;
  sales: number;
  rating: number;
}
