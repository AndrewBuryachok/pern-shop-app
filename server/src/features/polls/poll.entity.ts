import { User } from '../users/user.entity';
import { Vote } from '../votes/vote.entity';

export class Poll {
  id: number;
  userId: number;
  user: User;
  description: string;
  createdAt: Date;
  votes: Vote[];
}
