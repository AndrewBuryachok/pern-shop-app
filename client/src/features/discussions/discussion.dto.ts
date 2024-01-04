export interface CreateDiscussionDto {
  pollId: number;
  text: string;
}

export interface DeleteDiscussionDto {
  discussionId: number;
}

export interface EditDiscussionDto extends DeleteDiscussionDto {
  text: string;
}
