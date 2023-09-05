import { PurchaseWithPrice } from '../purchases/purchase.model';
import { MdLot } from '../lots/lot.model';

export interface Bid extends PurchaseWithPrice {
  lot: MdLot;
}
