import { SmUser } from '../users/user.model';
import { Vote } from './vote.model';

export interface Poll {
  id: number;
  user: SmUser;
  title: string;
  text: string;
  createdAt: Date;
  completedAt?: Date;
  votes: Vote[];
}
