import { Place, PlaceWithCard, SmPlaceWithCard } from '../places/place.model';
import { State } from '../states/state.model';
import { SmStore } from '../stores/store.model';

export interface SmMarket extends Place {}

export interface SmMarketWithCard extends SmPlaceWithCard {}

export interface MdMarket extends PlaceWithCard {}

export interface Market extends MdMarket {
  states: State[];
  stores: SmStore[];
}

export interface MyMarket extends SmMarket {
  stores: number;
}
