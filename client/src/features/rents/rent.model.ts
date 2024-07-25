import { MdReceipt, Receipt, SmReceipt } from '../receipts/receipt.model';
import { LgStore, LgStoreWithTag, MdStore } from '../stores/store.model';

export interface SmRent extends SmReceipt {
  store: LgStore;
}

export interface MdRent extends MdReceipt {
  store: LgStore;
}

export interface Rent extends Receipt {
  store: LgStoreWithTag;
  things: number;
}

export interface SelectRent {
  id: number;
  store: MdStore;
}
