import { Place, PlaceWithCard } from '../places/place.model';
import { SmStore } from '../stores/store.model';

export interface SmMarket extends Place {}

export interface MdMarket extends PlaceWithCard {}

export interface Market extends MdMarket {
  stores: SmStore[];
}

export interface SelectMarket extends SmMarket {
  stores: number;
}
