import { SmPoll } from '../polls/poll.model';
import { SmUser } from '../users/user.model';

export interface SmVote {
  id: number;
  type: boolean;
}

export interface Vote extends SmVote {
  poll: SmPoll;
  user: SmUser;
  createdAt: Date;
}
