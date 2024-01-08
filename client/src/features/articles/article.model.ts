import { SmUser } from '../users/user.model';

export interface SmArticle {
  id: number;
}

export interface Article {
  id: number;
  user: SmUser;
  text: string;
  image: string;
  createdAt: Date;
  likes: number;
  comments: number;
}
