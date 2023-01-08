import { Poll } from '../polls/poll.entity';
import { User } from '../users/user.entity';

export class Vote {
  id: number;
  pollId: number;
  poll: Poll;
  userId: number;
  user: User;
  type: boolean;
  createdAt: Date;
}
