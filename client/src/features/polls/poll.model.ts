import { SmUser } from '../users/user.model';

export interface SmPoll {
  id: number;
  vote: { id: number; type: boolean };
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
  upVotes: number;
  downVotes: number;
  discussions: number;
}
