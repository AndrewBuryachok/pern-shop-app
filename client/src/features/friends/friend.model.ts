import { SmUser } from '../users/user.model';

export interface Friend {
  id: number;
  senderUser: SmUser;
  receiverUser: SmUser;
  type: boolean;
  createdAt: Date;
}
