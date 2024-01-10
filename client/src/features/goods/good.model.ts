import { LgThing } from '../things/thing.model';
import { MdShop } from '../shops/shop.model';

export interface Good extends LgThing {
  shop: MdShop;
}
