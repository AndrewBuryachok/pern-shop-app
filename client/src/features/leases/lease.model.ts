import { ReceiptWithDate } from '../receipts/receipt.model';
import { LgCell } from '../cells/cell.model';
import { SmProduct } from '../products/product.model';

export interface Lease extends ReceiptWithDate {
  cell: LgCell;
  products: SmProduct[];
}
