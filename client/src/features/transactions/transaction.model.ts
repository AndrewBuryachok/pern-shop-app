import { MdCard } from '../cards/card.model';

export interface Transaction {
  id: number;
  senderCard: MdCard;
  receiverCard: MdCard;
  sum: number;
  description: string;
  createdAt: Date;
}
