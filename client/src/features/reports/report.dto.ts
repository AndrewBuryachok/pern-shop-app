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

export interface ViewReportDto {
  reportId: number;
}

export interface LikeReportDto extends CreateReactionDto {
  reportId: number;
}

export interface ExtLikeReportDto extends LikeReportDto {
  upLiked: boolean;
  downLiked: boolean;
}
