export interface CreateCommentDto {
  articleId: number;
  text: string;
}

export interface DeleteCommentDto {
  commentId: number;
}

export interface EditCommentDto extends DeleteCommentDto {
  text: string;
}
