import { SmUser } from '../users/user.model';
import { SmReportComment } from './comment.model';

export interface Report {
  id: number;
  user: SmUser;
  text: string;
  images: string[];
  createdAt: Date;
  views: number;
  upLikes: number;
  downLikes: number;
  comments: number;
  comment?: SmReportComment;
}
