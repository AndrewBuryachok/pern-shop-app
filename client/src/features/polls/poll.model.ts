import { SmUser } from '../users/user.model';
import { SmVote } from '../votes/vote.model';

export interface SmPoll {
  id: number;
  user: SmUser;
  title: string;
  text: string;
}

export interface Poll extends SmPoll {
  upVotes: number;
  downVotes: number;
  myVote?: SmVote;
  createdAt: Date;
  completedAt?: Date;
}
