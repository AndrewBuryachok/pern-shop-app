import { SmHire } from '../hires/hire.model';
import { MdCard } from '../cards/card.model';
import { SmPurchaseWithoutPrice } from '../purchases/purchase.model';

export interface Delivery {
  id: number;
  hire: SmHire;
  purchase: SmPurchaseWithoutPrice;
  price: number;
  status: number;
  executorCard?: MdCard;
  createdAt: Date;
  completedAt?: Date;
  rate?: number;
}
