import { Haulage } from '../haulages/haulage.model';
import { SmBargainWithoutPrice } from '../bargains/bargain.model';

export interface ShopDelivery extends Haulage {
  bargain: SmBargainWithoutPrice;
}
