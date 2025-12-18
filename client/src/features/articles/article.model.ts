import { SmUser } from '../users/user.model';
import { SmComment } from './comment.model';

export interface Article {
  id: number;
  user: SmUser;
  text: string;
  images: string[];
  createdAt: Date;
  views: number;
  upLikes: number;
  downLikes: number;
  comments: number;
  comment?: SmComment;
}

export interface AuthArticle {
  view: number[];
  up: number[];
  down: number[];
}
