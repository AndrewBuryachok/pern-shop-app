import { Purchase } from '../purchases/purchase.entity';
import { Ware } from '../wares/ware.entity';

export class Trade extends Purchase {
  wareId: number;
  ware: Ware;
}
