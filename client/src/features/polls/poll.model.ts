import { SmVote } from './vote.model';
import { SmUser } from '../users/user.model';
import { SmDiscussion } from '../discussions/discussion.model';

export interface SmPoll {
  id: number;
  vote: SmVote;
}

export interface Poll {
  id: number;
  user: SmUser;
  text: string;
  mark: number;
  image: string;
  video: string;
  result: number;
  createdAt: Date;
  completedAt?: Date;
  views: number;
  upVotes: number;
  downVotes: number;
  discussions: number;
  discussion?: SmDiscussion;
}
