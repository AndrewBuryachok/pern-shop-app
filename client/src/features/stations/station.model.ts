import { Place, PlaceWithCard, PlaceWithPrice } from '../places/place.model';

export interface SmStation extends Place {}

export interface SmStationWithPrice extends SmStation {
  price: number;
}

export interface MdStation extends PlaceWithCard {}

export interface MdStationWithPrice extends PlaceWithPrice {}

export interface Station extends MdStationWithPrice {
  image: string;
  video: string;
  description: string;
  createdAt: Date;
  drawers: number;
}

export interface MyStation extends SmStation {
  drawers: number;
}
