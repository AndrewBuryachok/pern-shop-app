import { MdCard } from '../cards/card.model';

export interface SmPurchase {
  id: number;
  amount: number;
}

export interface Purchase extends SmPurchase {
  card: MdCard;
  createdAt: Date;
  rate?: number;
}
