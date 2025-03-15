import { SmUser } from '../users/user.model';

export interface SmAccount {
  id: number;
  name: string;
  color: number;
}

export interface MdAccount extends SmAccount {
  user: SmUser;
}

export interface LgAccount extends MdAccount {
  balance: number;
}

export interface Account extends LgAccount {
  users: number;
}
