import { SmLike } from './like.model';
import { SmUser } from '../users/user.model';

export interface SmArticle {
  id: number;
  like: SmLike;
}

export interface Article {
  id: number;
  user: SmUser;
  text: string;
  image1: string;
  image2: string;
  image3: string;
  video: string;
  createdAt: Date;
  upLikes: number;
  downLikes: number;
  comments: number;
}
