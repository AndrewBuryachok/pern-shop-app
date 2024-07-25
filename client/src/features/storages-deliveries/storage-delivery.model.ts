import { Haulage } from '../haulages/haulage.model';
import { SmSaleWithoutPrice } from '../sales/sale.model';

export interface StorageDelivery extends Haulage {
  sale: SmSaleWithoutPrice;
}
