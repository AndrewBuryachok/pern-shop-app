import { SmReportLike } from './report-like.model';
import { SmUser } from '../users/user.model';
import { SmReportComment } from './comment.model';

export interface SmReport {
  id: number;
  like: SmReportLike;
}

export interface Report {
  id: number;
  user: SmUser;
  text: string;
  image1: string;
  image2: string;
  image3: string;
  video: string;
  createdAt: Date;
  views: number;
  upLikes: number;
  downLikes: number;
  comments: number;
  comment?: SmReportComment;
}
