import { SmUser } from '../users/user.model';

export interface Answer {
  id: number;
  user: SmUser;
  text: string;
  createdAt: Date;
}
