import { Delivery } from '../deliveries/delivery.model';
import { SmSaleWithoutPrice } from '../sales/sale.model';

export interface StorageDelivery extends Delivery {
  sale: SmSaleWithoutPrice;
}
