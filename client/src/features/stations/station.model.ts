import { Place, PlaceWithPrice } from '../places/place.model';

export interface SmStation extends Place {}

export interface SmStationWithPrice extends SmStation {
  price: number;
}

export interface MdStation extends PlaceWithPrice {}

export interface Station extends MdStation {
  image: string;
  video: string;
  description: string;
  createdAt: Date;
  drawers: number;
}

export interface MyStation extends SmStation {
  drawers: number;
}
