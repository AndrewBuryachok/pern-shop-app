import { Transportation } from '../transportations/transportation.model';

export interface Order extends Transportation {
  item: string;
  description: string;
  amount: number;
  intake: number;
  kit: number;
}
