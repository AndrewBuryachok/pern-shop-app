import { SmAttitude } from './attitude.model';
import { SmUser } from '../users/user.model';

export interface SmReport {
  id: number;
  attitude: SmAttitude;
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
  upAttitudes: number;
  downAttitudes: number;
  annotations: number;
}
