import { LgThing, SmThing, SmThingWithoutPrice } from '../things/thing.model';
import { MdCard } from '../cards/card.model';
import { MdShop } from '../shops/shop.model';
import { SmRent } from '../rents/rent.model';
import { SmLease } from '../leases/lease.model';

export interface SmGoodWithoutPrice extends SmThingWithoutPrice {
  shop?: MdShop;
  rent?: SmRent;
  lease?: SmLease;
}

export interface SmGood extends SmThing {}

export interface MdGood extends SmThing {
  card: MdCard;
  shop?: MdShop;
  rent?: SmRent;
  lease?: SmLease;
}

export interface Good extends LgThing {
  card: MdCard;
  shop?: MdShop;
  rent?: SmRent;
  lease?: SmLease;
  states: number;
  purchases: number;
  reviews: number;
}

export interface GoodReview {
  id: number;
  card: MdCard;
  rate: number;
  createdAt: Date;
}
