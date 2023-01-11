import { Purchase } from '../purchases/purchase.model';
import { MdWare } from '../wares/ware.model';

export interface Trade extends Purchase {
  ware: MdWare;
}
