import { MdCard } from '../cards/card.model';

export interface Payment {
  id: number;
  senderCard: MdCard;
  receiverCard: MdCard;
  sum: number;
  description: string;
  createdAt: Date;
}
