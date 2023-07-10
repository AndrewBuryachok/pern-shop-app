import { SmUser } from '../users/user.model';

export interface Task {
  id: number;
  customerUser: SmUser;
  description: string;
  priority: number;
  createdAt: Date;
  executorUser?: SmUser;
  completedAt?: Date;
  status: number;
}
