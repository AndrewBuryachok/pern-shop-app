import { Place, PlaceWithUser } from '../places/place.model';
import { SmUser } from '../users/user.model';

export interface SmCity extends Place {}

export interface MdCity extends PlaceWithUser {}

export interface City extends MdCity {
  image: string;
  description: string;
  users: SmUser[];
}
