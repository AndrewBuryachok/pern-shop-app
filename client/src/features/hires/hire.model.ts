import { Receipt, ReceiptWithDate } from '../receipts/receipt.model';
import { LgDrawer } from '../drawers/drawer.model';

export interface SmHire extends Receipt {
  drawer: LgDrawer;
}

export interface Hire extends ReceiptWithDate {
  drawer: LgDrawer;
}
