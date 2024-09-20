import { PlaceWithUser, SmPlace, SmPlaceWithUser } from '../places/place.model';

export interface SmTown extends SmPlace {}

export interface MdTown extends SmPlaceWithUser {}

export interface Town extends PlaceWithUser {
  users: number;
}
