import { PlaceWithCard, SmPlace, SmPlaceWithCard } from '../places/place.model';

export interface SmMarket extends SmPlace {}

export interface MdMarket extends SmPlaceWithCard {}

export interface Market extends PlaceWithCard {
  tags: number;
  stores: number;
}

export interface MyMarket extends SmMarket {
  stores: number;
}
