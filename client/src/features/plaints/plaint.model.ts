import { SmUser } from '../users/user.model';

export interface Plaint {
  id: number;
  senderUser: SmUser;
  receiverUser: SmUser;
  title: string;
  executorUser?: SmUser;
  text?: string;
  createdAt: Date;
  completedAt?: Date;
  answers: number;
}
