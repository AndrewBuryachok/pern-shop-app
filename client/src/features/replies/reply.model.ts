import { SmUser } from '../users/user.model';

export interface SmReply {
  id: number;
  user: SmUser;
  text: string;
}

export interface Reply extends SmReply {
  reply?: SmReply;
  createdAt: Date;
}
