import { SmUser } from '../users/user.model';

export interface Reaction {
  id: number;
  user: SmUser;
  type: boolean;
  createdAt: Date;
}
