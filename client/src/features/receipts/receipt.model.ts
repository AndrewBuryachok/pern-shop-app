import { MdCard } from '../cards/card.model';

export interface SmReceipt {
  id: number;
}

export interface Receipt extends SmReceipt {
  card: MdCard;
  sum: number;
  createdAt: Date;
  completedAt: Date;
}
