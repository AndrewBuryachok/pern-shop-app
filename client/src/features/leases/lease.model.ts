import { MdReceipt, Receipt, SmReceipt } from '../receipts/receipt.model';
import { LgCell } from '../cells/cell.model';

export interface SmLease extends SmReceipt {
  cell: LgCell;
}

export interface MdLease extends MdReceipt {
  cell: LgCell;
}

export interface Lease extends Receipt {
  cell: LgCell;
}
