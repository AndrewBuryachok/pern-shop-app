import { MdCard } from '../cards/card.model';

export interface Purchase {
  id: number;
  card: MdCard;
  amount: number;
  createdAt: Date;
  rate?: number;
}
