import { Place, PlaceWithUser } from '../places/place.model';

export interface SmCity extends Place {}

export interface MdCity extends PlaceWithUser {}

export interface City extends MdCity {
  image: string;
  description: string;
  users: number;
}
