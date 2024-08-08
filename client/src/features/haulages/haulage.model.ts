import { SmHire } from '../hires/hire.model';
import { MdCard } from '../cards/card.model';

export interface Haulage {
  id: number;
  hire: SmHire;
  price: number;
  status: number;
  executorCard?: MdCard;
  createdAt: Date;
  completedAt?: Date;
  rate?: number;
}
