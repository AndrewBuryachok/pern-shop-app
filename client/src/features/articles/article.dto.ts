export interface CreateArticleDto {
  text: string;
  image: string;
}

export interface EditArticleDto extends CreateArticleDto {
  articleId: number;
}

export interface DeleteArticleDto {
  articleId: number;
}

export interface LikeArticleDto {
  articleId: number;
}
