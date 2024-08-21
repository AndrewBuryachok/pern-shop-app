import { PlaceWithUser, SmPlace, SmPlaceWithUser } from '../places/place.model';

export interface SmFarm extends SmPlace {}

export interface MdFarm extends SmPlaceWithUser {}

export interface Farm extends PlaceWithUser {
  users: number;
}
