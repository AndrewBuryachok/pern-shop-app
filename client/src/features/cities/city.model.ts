import { Place, PlaceWithUser, SmPlaceWithUser } from '../places/place.model';
import { SmUser } from '../users/user.model';

export interface SmCity extends Place {}

export interface SmCityWithUser extends SmPlaceWithUser {}

export interface City extends PlaceWithUser {
  users: SmUser[];
}
