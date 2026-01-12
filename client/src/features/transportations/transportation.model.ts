import { MdStation } from '../stations/station.model';
import { MdCard } from '../cards/card.model';

export interface SmTransportation {
  id: number;
  status: number;
  executorCard?: MdCard;
}

export interface Transportation extends SmTransportation {
  station: MdStation;
  customerCard: MdCard;
  sum: number;
  createdAt: Date;
  completedAt?: Date;
  rate?: number;
}
