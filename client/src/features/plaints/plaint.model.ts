import { SmUser } from '../users/user.model';

export interface Plaint {
  id: number;
  title: string;
  senderUser: SmUser;
  senderText: string;
  receiverUser: SmUser;
  receiverText?: string;
  executorUser?: SmUser;
  executorText?: string;
  createdAt: Date;
  executedAt?: Date;
  completedAt?: Date;
}
