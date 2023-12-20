import { MdCity } from '../cities/city.model';
import { SmUser } from '../users/user.model';

export interface Task {
  id: number;
  city: MdCity;
  customerUser: SmUser;
  title: string;
  text: string;
  priority: number;
  createdAt: Date;
  executorUser?: SmUser;
  completedAt?: Date;
  status: number;
}
