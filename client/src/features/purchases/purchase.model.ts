import { MdGood, SmGood, SmGoodWithoutPrice } from '../goods/good.model';
import { MdWare, SmWare, SmWareWithoutPrice } from '../wares/ware.model';
import {
  MdProduct,
  SmProduct,
  SmProductWithoutPrice,
} from '../products/product.model';
import { MdCard } from '../cards/card.model';

export interface SmPurchase {
  id: number;
  amount: number;
}

export interface SmPurchaseWithoutPrice extends SmPurchase {
  good?: SmGoodWithoutPrice;
  ware?: SmWareWithoutPrice;
  product?: SmProductWithoutPrice;
}

export interface SmPurchaseWithPrice extends SmPurchase {
  good?: SmGood;
  ware?: SmWare;
  product?: SmProduct;
}

export interface Purchase extends SmPurchase {
  good?: MdGood;
  ware?: MdWare;
  product?: MdProduct;
  card: MdCard;
  createdAt: Date;
  rate?: number;
}
