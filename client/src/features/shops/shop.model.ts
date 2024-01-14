import { Place, PlaceWithUser } from '../places/place.model';

export interface SmShop extends Place {}

export interface MdShop extends PlaceWithUser {}

export interface Shop extends MdShop {
  image: string;
  description: string;
  users: number;
  goods: number;
}
