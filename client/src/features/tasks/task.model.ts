import { Service } from '../services/service.model';
import { MdCard } from '../cards/card.model';

export interface Task extends Service {
  customerCard: MdCard;
  status: number;
  executorCard?: MdCard;
  completedAt?: Date;
  rate?: number;
}
