import { Purchase, SmPurchase } from '../purchases/purchase.model';
import { MdGood, SmGood, SmGoodWithoutPrice } from '../goods/good.model';

export interface SmBargainWithoutPrice extends SmPurchase {
  good: SmGoodWithoutPrice;
}

export interface SmBargain extends SmPurchase {
  good: SmGood;
}

export interface Bargain extends Purchase {
  good: MdGood;
}
