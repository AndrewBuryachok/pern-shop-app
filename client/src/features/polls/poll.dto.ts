export interface CreatePollDto {
  title: string;
  text: string;
}

export interface ExtCreatePollDto extends CreatePollDto {
  userId: number;
}

export interface DeletePollDto {
  pollId: number;
}

export interface CompletePollDto extends DeletePollDto {
  result: number;
}

export interface VotePollDto extends DeletePollDto {
  type: boolean;
}
