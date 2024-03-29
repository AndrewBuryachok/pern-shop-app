import { SmUser } from '../users/user.model';

export interface Task {
  id: number;
  customerUser: SmUser;
  title: string;
  text: string;
  priority: number;
  createdAt: Date;
  executorUser?: SmUser;
  completedAt?: Date;
  status: number;
}
