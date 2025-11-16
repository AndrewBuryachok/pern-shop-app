import { CreateReactionDto } from '../reactions/reaction.dto';

export interface CreateReportDto {
  text: string;
  images: string[];
}

export interface EditReportDto extends CreateReportDto {
  reportId: number;
}

export interface DeleteReportDto {
  reportId: number;
}

export interface ViewReportDto {
  reportId: number;
}

export interface LikeReportDto extends CreateReactionDto {
  reportId: number;
}
