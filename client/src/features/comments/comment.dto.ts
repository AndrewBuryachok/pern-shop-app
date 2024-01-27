import { CreateReplyDto } from '../replies/reply.dto';

export interface CreateCommentDto extends CreateReplyDto {
  articleId: number;
  commentId: number;
}

export interface EditCommentDto extends CreateReplyDto {
  commentId: number;
}

export interface DeleteCommentDto {
  commentId: number;
}
