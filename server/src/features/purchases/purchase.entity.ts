import { Card } from '../cards/card.entity';

export abstract class Purchase {
  id: number;
  cardId: number;
  card: Card;
  amount: number;
  createdAt: Date;
}
