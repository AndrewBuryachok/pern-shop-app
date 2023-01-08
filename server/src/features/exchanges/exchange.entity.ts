import { User } from '../users/user.entity';
import { Card } from '../cards/card.entity';

export class Exchange {
  id: number;
  executorUserId: number;
  executorUser: User;
  customerCardId: number;
  customerCard: Card;
  type: boolean;
  sum: number;
  createdAt: Date;
}
