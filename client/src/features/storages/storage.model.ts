import { PlaceWithCard, SmPlace, SmPlaceWithCard } from '../places/place.model';

export interface SmStorage extends SmPlace {}

export interface MdStorage extends SmPlaceWithCard {}

export interface Storage extends PlaceWithCard {
  tags: number;
  cells: number;
}

export interface MyStorage extends SmStorage {
  cells: number;
}
