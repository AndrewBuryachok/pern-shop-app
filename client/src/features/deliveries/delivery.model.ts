import { MdCard } from '../cards/card.model';
import { SmPurchaseWithoutPrice } from '../purchases/purchase.model';
import { SmHire } from '../hires/hire.model';

export interface SmDelivery {
  id: number;
  status: number;
  executorCard?: MdCard;
}

export interface Delivery extends SmDelivery {
  purchase: SmPurchaseWithoutPrice;
  hire: SmHire;
  price: number;
  createdAt: Date;
  completedAt?: Date;
  rate?: number;
}
