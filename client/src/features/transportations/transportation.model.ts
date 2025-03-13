import { LgThing } from '../things/thing.model';
import { MdCard } from '../cards/card.model';

export interface Transportation extends LgThing {
  status: number;
  executorCard?: MdCard;
  completedAt?: Date;
  rate?: number;
}
