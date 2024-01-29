import { CreateReactionDto } from '../reactions/reaction.dto';

export interface CreateReportDto {
  text: string;
  image1: string;
  image2: string;
  image3: string;
  video: string;
}

export interface EditReportDto extends CreateReportDto {
  reportId: number;
}

export interface DeleteReportDto {
  reportId: number;
}

export interface AttitudeReportDto extends CreateReactionDto {
  reportId: number;
}
