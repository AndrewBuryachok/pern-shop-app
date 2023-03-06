import { MdCard } from '../cards/card.model';
import { SmUser } from '../users/user.model';

export interface Invoice {
  id: number;
  senderCard: MdCard;
  receiverCard?: MdCard;
  receiverUser: SmUser;
  sum: number;
  description: string;
  createdAt: Date;
  completedAt?: Date;
}
