import { SmUser } from '../users/user.model';

export interface Vote {
  id: number;
  user: SmUser;
  type: boolean;
}
