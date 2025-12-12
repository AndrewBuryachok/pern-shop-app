import { PlaceWithUser, SmPlace, SmPlaceWithUser } from '../places/place.model';

export interface SmStation extends SmPlace {}

export interface MdStation extends SmPlaceWithUser {}

export interface Station extends PlaceWithUser {}
