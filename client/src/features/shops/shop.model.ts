import { Place, PlaceWithUser } from '../places/place.model';
import { SmGood } from '../goods/good.model';

export interface SmShop extends Place {}

export interface MdShop extends PlaceWithUser {}

export interface Shop extends MdShop {
  image: string;
  description: string;
  goods: SmGood[];
}
