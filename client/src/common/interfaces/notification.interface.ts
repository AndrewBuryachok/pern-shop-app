import { SmUser } from '../../features/users/user.model';

export interface INotification {
  key: string;
  toUserId: number;
  page: string;
  id: number;
  action: string;
  fromUserId: number;
  date: Date;
  user?: SmUser;
}
