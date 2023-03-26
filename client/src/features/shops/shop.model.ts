import { Place, PlaceWithUser, SmPlaceWithUser } from '../places/place.model';
import { SmGood } from '../goods/good.model';

export interface SmShop extends Place {}

export interface SmShopWithUser extends SmPlaceWithUser {}

export interface MdShop extends PlaceWithUser {}

export interface Shop extends MdShop {
  goods: SmGood[];
}
