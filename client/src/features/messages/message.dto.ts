import { CreateReplyDto } from '../replies/reply.dto';

export interface CreateMessageDto extends CreateReplyDto {
  userId: number;
  messageId: number;
}

export interface EditMessageDto extends CreateReplyDto {
  messageId: number;
}

export interface DeleteMessageDto {
  messageId: number;
}
