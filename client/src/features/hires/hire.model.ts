import { MdReceipt, Receipt } from '../receipts/receipt.model';
import { LgBox } from '../boxes/box.model';

export interface SmHire extends MdReceipt {
  box: LgBox;
}

export interface Hire extends Receipt {
  box: LgBox;
  orders: number;
  fromHaulages: number;
  toHaulages: number;
  shopsDeliveries: number;
  marketsDeliveries: number;
  storagesDeliveries: number;
}
