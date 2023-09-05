import { MdCard } from '../cards/card.model';

export interface Purchase {
  id: number;
  card: MdCard;
  createdAt: Date;
}

export interface PurchaseWithAmount extends Purchase {
  amount: number;
  rate?: number;
}

export interface PurchaseWithPrice extends Purchase {
  price: number;
}
