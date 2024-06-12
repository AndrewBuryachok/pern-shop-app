import { Reply, SmReply } from '../replies/reply.model';
import { SmUser } from '../users/user.model';

export interface SmMessage extends SmReply {
  chat: SmUser;
  createdAt: Date;
}

export interface Message extends Reply {}
