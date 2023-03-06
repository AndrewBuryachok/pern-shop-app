export interface CreatePollDto {
  description: string;
}

export interface CompletePollDto {
  pollId: number;
}

export interface DeletePollDto {
  pollId: number;
}
