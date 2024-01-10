import { PurchaseWithAmount } from '../purchases/purchase.model';
import { SmWare } from '../wares/ware.model';

export interface Trade extends PurchaseWithAmount {
  ware: SmWare;
}
