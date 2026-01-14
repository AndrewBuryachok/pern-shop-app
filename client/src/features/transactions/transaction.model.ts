import { SmUser } from '../users/user.model';
import { MdCard } from '../cards/card.model';

export interface Transaction {
  id: number;
  executorUser?: SmUser;
  senderCard?: MdCard;
  receiverCard?: MdCard;
  sum: number;
  description: string;
  createdAt: Date;
}
