import { MdGood, SmGood, SmGoodWithoutPrice } from '../goods/good.model';
import { MdCard } from '../cards/card.model';
import { SmDelivery } from '../deliveries/delivery.model';

export interface SmPurchase {
  id: number;
  amount: number;
}

export interface SmPurchaseWithoutPrice extends SmPurchase {
  good: SmGoodWithoutPrice;
}

export interface SmPurchaseWithPrice extends SmPurchase {
  good: SmGood;
}

export interface MdPurchase extends SmPurchase {
  card: MdCard;
  createdAt: Date;
  delivery?: SmDelivery;
}

export interface Purchase extends MdPurchase {
  good: MdGood;
  rate?: number;
}
