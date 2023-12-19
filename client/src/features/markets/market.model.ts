import { Place, PlaceWithCard } from '../places/place.model';
import { State } from '../states/state.model';
import { SmStore } from '../stores/store.model';

export interface SmMarket extends Place {}

export interface MdMarket extends PlaceWithCard {}

export interface Market extends MdMarket {
  image: string;
  description: string;
  states: State[];
  stores: SmStore[];
}

export interface MyMarket extends SmMarket {
  stores: number;
}
