import { Account, LgAccount, MdAccount, SmAccount } from './account.model';
import { SmUser } from '../users/user.model';

export interface SmCard {
  id: number;
}

export interface MdCard extends SmCard {
  account: SmAccount;
  user: SmUser;
}

export interface LgCard extends SmCard {
  account: MdAccount;
}

export interface LgCardWithBalance extends SmCard {
  account: LgAccount;
}

export interface Card extends SmCard {
  account: Account;
  createdAt: Date;
}
