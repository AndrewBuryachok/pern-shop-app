import { LgThing, SmThing } from '../things/thing.model';
import { SmShop } from '../shops/shop.model';

export interface SmGood extends SmThing {}

export interface Good extends LgThing {
  shop: SmShop;
  createdAt: Date;
}
