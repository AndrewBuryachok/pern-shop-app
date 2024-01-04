import { SmUser } from '../users/user.model';

export interface Discussion {
  id: number;
  user: SmUser;
  text: string;
  createdAt: Date;
}
