import { Receipt, ReceiptWithDate } from '../receipts/receipt.model';
import { LgCell } from '../cells/cell.model';
import { SmThing } from '../things/thing.model';

export interface SmLease extends Receipt {
  cell: LgCell;
}

export interface Lease extends ReceiptWithDate {
  cell: LgCell;
  type: string;
  thing: SmThing;
}
