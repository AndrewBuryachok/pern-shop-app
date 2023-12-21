export interface CreatePollDto {
  title: string;
  text: string;
}

export interface PollIdDto {
  pollId: number;
}

export interface VotePollDto extends PollIdDto {
  type: boolean;
}
