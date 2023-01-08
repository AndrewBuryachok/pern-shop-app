import { Card } from '../cards/card.entity';

export class Payment {
  id: number;
  senderCardId: number;
  senderCard: Card;
  receiverCardId: number;
  receiverCard: Card;
  sum: number;
  description: string;
  createdAt: Date;
}
