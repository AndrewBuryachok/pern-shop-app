import { Place, PlaceWithCard } from '../places/place.model';

export interface SmMarket extends Place {}

export interface MdMarket extends PlaceWithCard {}

export interface Market extends MdMarket {
  image: string;
  video: string;
  description: string;
  createdAt: Date;
  stores: number;
}

export interface MyMarket extends SmMarket {
  stores: number;
}
