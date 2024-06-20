import { SmUser } from '../users/user.model';

export interface SmReply {
  id: number;
  user: SmUser;
  text: string;
  createdAt: Date;
}

export interface Reply extends SmReply {
  reply?: SmReply;
}
