import { SmUser } from '../users/user.model';

export interface Rating {
  id: number;
  senderUser: SmUser;
  receiverUser: SmUser;
  rate: number;
  createdAt: Date;
}
