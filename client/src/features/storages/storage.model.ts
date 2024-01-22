import { Place, PlaceWithCard } from '../places/place.model';

export interface SmStorage extends Place {}

export interface SmStorageWithPrice extends SmStorage {
  price: number;
}

export interface MdStorage extends PlaceWithCard {}

export interface Storage extends MdStorage {
  image: string;
  video: string;
  description: string;
  createdAt: Date;
  cells: number;
}

export interface MyStorage extends SmStorage {
  cells: number;
}
