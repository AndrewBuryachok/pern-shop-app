import { Service } from '../services/service.model';
import { MdCard } from '../cards/card.model';

export interface Advert extends Service {
  card: MdCard;
}
