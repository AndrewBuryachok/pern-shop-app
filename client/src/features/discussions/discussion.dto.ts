import { CreateReplyDto } from '../replies/reply.dto';

export interface CreateDiscussionDto extends CreateReplyDto {
  pollId: number;
}

export interface EditDiscussionDto extends CreateReplyDto {
  discussionId: number;
}

export interface DeleteDiscussionDto {
  discussionId: number;
}
