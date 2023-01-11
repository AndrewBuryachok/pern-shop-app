import { MdCard } from '../cards/card.model';

export interface Receipt {
  id: number;
  card: MdCard;
}

export interface ReceiptWithDate extends Receipt {
  createdAt: Date;
}
