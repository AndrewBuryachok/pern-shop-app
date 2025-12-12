import { MdCard } from '../cards/card.model';
import { SmHire } from '../hires/hire.model';

export interface SmTransportation {
  id: number;
  status: number;
  executorCard?: MdCard;
}

export interface Transportation extends SmTransportation {
  hire: SmHire;
  price: number;
  createdAt: Date;
  completedAt?: Date;
  rate?: number;
}
