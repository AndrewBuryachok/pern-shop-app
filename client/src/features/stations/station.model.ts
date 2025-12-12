import {
  PlaceWithPrice,
  SmPlace,
  SmPlaceWithCard,
} from '../places/place.model';

export interface SmStation extends SmPlace {}

export interface MdStation extends SmPlaceWithCard {}

export interface Station extends PlaceWithPrice {}
