import { LgThing, SmThing, SmThingWithoutPrice } from '../things/thing.model';
import { MdShop } from '../shops/shop.model';
import { MdRent, SmRent } from '../rents/rent.model';
import { MdLease, SmLease } from '../leases/lease.model';

export interface SmGoodWithoutPrice extends SmThingWithoutPrice {
  shop?: MdShop;
  rent?: SmRent;
  lease?: SmLease;
}

export interface SmGood extends SmThing {}

export interface MdGood extends SmThing {
  shop?: MdShop;
  rent?: MdRent;
  lease?: MdLease;
}

export interface Good extends LgThing {
  shop?: MdShop;
  rent?: MdRent;
  lease?: MdLease;
  states: number;
  purchases: number;
}
