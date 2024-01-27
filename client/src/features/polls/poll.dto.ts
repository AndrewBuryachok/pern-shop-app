import { CreateReactionDto } from '../reactions/reaction.dto';

export interface CreatePollDto {
  text: string;
  mark: number;
  image: string;
  video: string;
}

export interface ExtCreatePollDto extends CreatePollDto {
  userId: number;
}

export interface EditPollDto extends CreatePollDto {
  pollId: number;
}

export interface DeletePollDto {
  pollId: number;
}

export interface CompletePollDto extends CreateReactionDto {
  pollId: number;
}

export interface VotePollDto extends CreateReactionDto {
  pollId: number;
}
