import { SmUser } from '../users/user.model';
import { Like } from './like.model';
import { Comment } from '../comments/comment.model';

export interface Article {
  id: number;
  user: SmUser;
  text: string;
  image: string;
  createdAt: Date;
  likes: Like[];
  comments: Comment[];
}
