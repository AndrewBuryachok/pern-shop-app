import { Receipt, SmReceipt } from '../receipts/receipt.model';
import { LgCell, MdCell } from '../cells/cell.model';

export interface SmLease extends SmReceipt {
  cell: LgCell;
}

export interface Lease extends Receipt {
  cell: LgCell;
  things: number;
}

export interface SelectLease {
  id: number;
  cell: MdCell;
}
