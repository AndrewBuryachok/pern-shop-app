import { SmUser } from '../users/user.model';
import { SmPollComment } from './comment.model';

export interface Poll {
  id: number;
  user: SmUser;
  text: string;
  mark: number;
  image: string;
  result: number;
  createdAt: Date;
  completedAt?: Date;
  views: number;
  upLikes: number;
  downLikes: number;
  comments: number;
  comment?: SmPollComment;
}
