import { MdReceipt, Receipt, SmReceipt } from '../receipts/receipt.model';
import { LgStall, MdStall } from '../stalls/stall.model';

export interface SmRent extends SmReceipt {
  stall: LgStall;
}

export interface MdRent extends MdReceipt {
  stall: LgStall;
}

export interface Rent extends Receipt {
  stall: LgStall;
  things: number;
}

export interface SelectRent {
  id: number;
  stall: MdStall;
}
