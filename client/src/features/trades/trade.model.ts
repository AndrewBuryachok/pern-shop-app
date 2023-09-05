import { PurchaseWithAmount } from '../purchases/purchase.model';
import { MdWare } from '../wares/ware.model';

export interface Trade extends PurchaseWithAmount {
  ware: MdWare;
}
