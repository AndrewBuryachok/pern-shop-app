import { Place, PlaceWithCard } from '../places/place.model';
import { SmCell } from '../cells/cell.model';

export interface SmStorage extends Place {}

export interface MdStorage extends PlaceWithCard {}

export interface Storage extends MdStorage {
  cells: SmCell[];
}

export interface SelectStorage extends SmStorage {
  cells: number;
}

export interface SelectStorageWithPrice extends SmStorage {
  price: number;
}
