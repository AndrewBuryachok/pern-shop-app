import { MdCard } from '../cards/card.model';

export interface SmReceipt {
  id: number;
}

export interface MdReceipt extends SmReceipt {
  card: MdCard;
}

export interface Receipt extends MdReceipt {
  createdAt: Date;
  completedAt: Date;
}
