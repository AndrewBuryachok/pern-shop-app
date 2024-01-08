import { Receipt, ReceiptWithDate } from '../receipts/receipt.model';
import { LgStore, MdStore } from '../stores/store.model';

export interface SmRent extends Receipt {
  store: LgStore;
}

export interface Rent extends ReceiptWithDate {
  store: LgStore;
  things: number;
}

export interface SelectRent {
  id: number;
  store: MdStore;
}
