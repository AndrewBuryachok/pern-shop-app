import { MdReceipt, Receipt } from '../receipts/receipt.model';
import { LgDrawer, LgDrawerWithPrice } from '../drawers/drawer.model';

export interface SmHire extends MdReceipt {
  drawer: LgDrawer;
}

export interface Hire extends Receipt {
  drawer: LgDrawerWithPrice;
}
