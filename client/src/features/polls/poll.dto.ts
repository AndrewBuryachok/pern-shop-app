export interface CreatePollDto {
  title: string;
  text: string;
}

export interface CompletePollDto {
  pollId: number;
}

export interface DeletePollDto {
  pollId: number;
}
