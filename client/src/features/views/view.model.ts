import { SmUser } from '../users/user.model';

export interface View {
  id: number;
  user: SmUser;
  createdAt: Date;
}
