import { CreateReplyDto } from '../replies/reply.dto';

export interface CreateAnnotationDto extends CreateReplyDto {
  reportId: number;
  annotationId: number;
}

export interface EditAnnotationDto extends CreateReplyDto {
  annotationId: number;
}

export interface DeleteAnnotationDto {
  annotationId: number;
}
