import { MdReceipt, Receipt, SmReceipt } from '../receipts/receipt.model';
import { LgStore, MdStore } from '../stores/store.model';

export interface SmRent extends SmReceipt {
  store: LgStore;
}

export interface MdRent extends MdReceipt {
  store: LgStore;
}

export interface Rent extends Receipt {
  store: LgStore;
  things: number;
}

export interface SelectRent {
  id: number;
  store: MdStore;
}
