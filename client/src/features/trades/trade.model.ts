import { Purchase, SmPurchase } from '../purchases/purchase.model';
import { MdWare, SmWare, SmWareWithoutPrice } from '../wares/ware.model';

export interface SmTradeWithoutPrice extends SmPurchase {
  ware: SmWareWithoutPrice;
}

export interface SmTrade extends SmPurchase {
  ware: SmWare;
}

export interface Trade extends Purchase {
  ware: MdWare;
}
