import { PlaceWithUser } from '../places/place.model';
import { SmGood } from '../goods/good.model';

export interface SmShop extends PlaceWithUser {}

export interface Shop extends SmShop {
  goods: SmGood[];
}
