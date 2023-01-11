import { Place, PlaceWithUser } from '../places/place.model';
import { SmUser } from '../users/user.model';

export interface SmCity extends Place {}

export interface City extends PlaceWithUser {
  users: SmUser[];
}
