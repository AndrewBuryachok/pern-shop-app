import { Thing, ThingWithPrice } from '../things/thing.model';
import { SmShop } from '../shops/shop.model';

export interface SmGood extends Thing {}

export interface Good extends ThingWithPrice {
  shop: SmShop;
  createdAt: Date;
}
