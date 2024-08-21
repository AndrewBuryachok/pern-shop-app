import { PlaceWithCard, SmPlace, SmPlaceWithCard } from '../places/place.model';

export interface SmShop extends SmPlace {}

export interface MdShop extends SmPlaceWithCard {}

export interface Shop extends PlaceWithCard {
  goods: number;
}
