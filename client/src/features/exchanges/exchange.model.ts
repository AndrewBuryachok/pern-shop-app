import { SmUser } from '../users/user.model';
import { MdCard } from '../cards/card.model';

export interface Exchange {
  id: number;
  executorUser: SmUser;
  customerCard: MdCard;
  type: boolean;
  sum: number;
  createdAt: Date;
}
