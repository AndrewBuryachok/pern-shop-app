import { PlaceWithUser, SmPlace, SmPlaceWithUser } from '../places/place.model';

export interface SmCity extends SmPlace {}

export interface MdCity extends SmPlaceWithUser {}

export interface City extends PlaceWithUser {
  users: number;
}
