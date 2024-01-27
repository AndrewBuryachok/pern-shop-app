import { SmUser } from '../users/user.model';

export interface Reply {
  id: number;
  user: SmUser;
  text: string;
  createdAt: Date;
}
