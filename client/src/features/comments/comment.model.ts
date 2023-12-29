import { SmUser } from '../users/user.model';

export interface Comment {
  id: number;
  user: SmUser;
  text: string;
  createdAt: Date;
}
