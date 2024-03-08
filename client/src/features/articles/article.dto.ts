import { CreateReactionDto } from '../reactions/reaction.dto';

export interface CreateArticleDto {
  text: string;
  image1: string;
  image2: string;
  image3: string;
  video: string;
}

export interface ExtCreateArticleDto extends CreateArticleDto {
  userId: number;
}

export interface EditArticleDto extends CreateArticleDto {
  articleId: number;
}

export interface DeleteArticleDto {
  articleId: number;
}

export interface ViewArticleDto {
  articleId: number;
}

export interface LikeArticleDto extends CreateReactionDto {
  articleId: number;
}
