import { LgThing, SmThing } from '../things/thing.model';
import { MdShop } from '../shops/shop.model';

export interface SmGood extends SmThing {}

export interface Good extends LgThing {
  shop: MdShop;
}
