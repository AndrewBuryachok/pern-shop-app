import { Place, PlaceWithCard, SmPlaceWithCard } from '../places/place.model';
import { SmCell } from '../cells/cell.model';

export interface SmStorage extends Place {}

export interface SmStorageWithCard extends SmPlaceWithCard {}

export interface SmStorageWithPrice extends SmStorage {
  price: number;
}

export interface MdStorage extends PlaceWithCard {}

export interface Storage extends MdStorage {
  cells: SmCell[];
}

export interface MyStorage extends SmStorage {
  cells: number;
}
