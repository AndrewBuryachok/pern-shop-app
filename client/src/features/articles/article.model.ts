import { SmUser } from '../users/user.model';

export interface SmArticle {
  id: number;
}

export interface Article {
  id: number;
  user: SmUser;
  text: string;
  image1: string;
  image2: string;
  image3: string;
  createdAt: Date;
  likes: number;
  comments: number;
}
