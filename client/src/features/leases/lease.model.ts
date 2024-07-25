import { MdReceipt, Receipt, SmReceipt } from '../receipts/receipt.model';
import { LgCell, LgCellWithTag } from '../cells/cell.model';

export interface SmLease extends SmReceipt {
  cell: LgCell;
}

export interface MdLease extends MdReceipt {
  cell: LgCell;
}

export interface Lease extends Receipt {
  cell: LgCellWithTag;
}
