import { SmUser } from '../users/user.model';

export interface Plaint {
  id: number;
  senderUser: SmUser;
  senderDescription: string;
  receiverUser: SmUser;
  receiverDescription?: string;
  executorUser?: SmUser;
  executorDescription?: string;
  createdAt: Date;
  executedAt?: Date;
  completedAt?: Date;
}
