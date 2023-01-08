import { Thing } from '../things/thing.entity';
import { Shop } from '../shops/shop.entity';

export class Good extends Thing {
  shopId: number;
  shop: Shop;
}
