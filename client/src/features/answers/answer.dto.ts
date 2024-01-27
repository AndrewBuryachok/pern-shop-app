import { CreateReplyDto } from '../replies/reply.dto';

export interface CreateAnswerDto extends CreateReplyDto {
  plaintId: number;
}

export interface EditAnswerDto extends CreateReplyDto {
  answerId: number;
}

export interface DeleteAnswerDto {
  answerId: number;
}
