import { SmVote } from './vote.model';
import { SmUser } from '../users/user.model';
import { SmPollComment } from './comment.model';

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
  comments: number;
  comment?: SmPollComment;
}
