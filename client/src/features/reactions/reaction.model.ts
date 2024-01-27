import { SmUser } from '../users/user.model';

export interface SmReaction {
  id: number;
  type: boolean;
}

export interface Reaction extends SmReaction {
  user: SmUser;
  createdAt: Date;
}
