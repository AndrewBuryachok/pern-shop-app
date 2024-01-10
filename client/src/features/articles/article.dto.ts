export interface CreateArticleDto {
  text: string;
  image1: string;
  image2: string;
  image3: string;
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
