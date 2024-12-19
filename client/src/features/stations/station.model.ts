import {
  PlaceWithPrice,
  SmPlace,
  SmPlaceWithCard,
  SmPlaceWithPrice,
} from '../places/place.model';

export interface SmStation extends SmPlace {}

export interface SmStationWithPrice extends SmStation {
  price: number;
}

export interface MdStation extends SmPlaceWithCard {}

export interface MdStationWithPrice extends SmPlaceWithPrice {}

export interface Station extends PlaceWithPrice {
  boxes: number;
}

export interface MyStation extends SmStation {
  boxes: number;
}
