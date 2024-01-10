import { PurchaseWithPrice } from '../purchases/purchase.model';
import { SmLot } from '../lots/lot.model';

export interface Bid extends PurchaseWithPrice {
  lot: SmLot;
}
