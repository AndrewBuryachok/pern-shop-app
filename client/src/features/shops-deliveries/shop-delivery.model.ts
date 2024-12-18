import { Delivery } from '../deliveries/delivery.model';
import { SmBargainWithoutPrice } from '../bargains/bargain.model';

export interface ShopDelivery extends Delivery {
  bargain: SmBargainWithoutPrice;
}
