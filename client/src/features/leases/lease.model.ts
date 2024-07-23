import { Receipt, ReceiptWithDate } from '../receipts/receipt.model';
import { LgCell } from '../cells/cell.model';

export interface SmLease extends Receipt {
  cell: LgCell;
}

export interface Lease extends ReceiptWithDate {
  cell: LgCell;
}
