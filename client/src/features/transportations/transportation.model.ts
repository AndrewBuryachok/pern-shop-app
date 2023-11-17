import { LgThing } from '../things/thing.model';
import { MdCard } from '../cards/card.model';

export interface Transportation extends LgThing {
  executorCard?: MdCard;
  status: number;
  rate?: number;
}
