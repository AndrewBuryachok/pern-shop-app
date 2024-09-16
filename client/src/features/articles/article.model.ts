import { SmArticleLike } from './article-like.model';
import { SmUser } from '../users/user.model';
import { SmArticleComment } from './comment.model';

export interface SmArticle {
  id: number;
  like: SmArticleLike;
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
  views: number;
  upLikes: number;
  downLikes: number;
  comments: number;
  comment?: SmArticleComment;
}
