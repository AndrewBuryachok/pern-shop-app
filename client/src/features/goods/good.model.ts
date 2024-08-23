import { LgThing, SmThing, SmThingWithoutPrice } from '../things/thing.model';
import { MdShop } from '../shops/shop.model';

export interface SmGoodWithoutPrice extends SmThingWithoutPrice {
  shop: MdShop;
}

export interface SmGood extends SmThing {}

export interface MdGood extends SmThing {
  shop: MdShop;
}

export interface Good extends LgThing {
  shop: MdShop;
  states: number;
}
