import { LgThing, SmThing, SmThingWithoutPrice } from '../things/thing.model';
import { MdCard } from '../cards/card.model';
import { MdShop } from '../shops/shop.model';

export interface SmGoodWithoutPrice extends SmThingWithoutPrice {
  shop: MdShop;
}

export interface SmGood extends SmThing {}

export interface MdGood extends SmThing {
  card: MdCard;
  shop: MdShop;
}

export interface Good extends LgThing {
  card: MdCard;
  shop: MdShop;
  states: number;
  purchases: number;
}
