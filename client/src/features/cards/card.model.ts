import { SmUser } from '../users/user.model';

export interface SmCard {
  id: number;
  name: string;
  color: number;
}

export interface MdCard extends SmCard {
  user: SmUser;
}

export interface Card extends MdCard {
  balance: number;
}

export interface SelectCard {
  id: number;
  name: string;
}

export interface SelectCardWithBalance extends SelectCard {
  balance: number;
}
