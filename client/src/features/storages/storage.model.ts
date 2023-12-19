import { Place, PlaceWithCard } from '../places/place.model';
import { State } from '../states/state.model';
import { SmCell } from '../cells/cell.model';

export interface SmStorage extends Place {}

export interface SmStorageWithPrice extends SmStorage {
  price: number;
}

export interface MdStorage extends PlaceWithCard {}

export interface Storage extends MdStorage {
  image: string;
  description: string;
  states: State[];
  cells: SmCell[];
}

export interface MyStorage extends SmStorage {
  cells: number;
}
