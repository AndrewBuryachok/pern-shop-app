import { Receipt, ReceiptWithDate } from '../receipts/receipt.model';
import { LgStore, MdStore } from '../stores/store.model';
import { SmWare } from '../wares/ware.model';

export interface SmRent extends Receipt {
  store: LgStore;
}

export interface Rent extends ReceiptWithDate {
  store: LgStore;
  wares: SmWare[];
}

export interface SelectRent {
  id: number;
  store: MdStore;
}
