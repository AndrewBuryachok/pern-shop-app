import { SmUser } from '../users/user.model';
import { Like } from './like.model';

export interface Article {
  id: number;
  user: SmUser;
  text: string;
  image: string;
  createdAt: Date;
  likes: Like[];
}
