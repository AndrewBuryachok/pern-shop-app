import { SmUser } from '../users/user.model';

export interface SmCard {
  id: number;
  name: string;
  color: number;
}

export interface MdCard extends SmCard {
  user: SmUser;
}

export interface MdCardWithBalance extends MdCard {
  balance: number;
}

export interface Card extends MdCard {
  balance: number;
  users: SmUser[];
}
