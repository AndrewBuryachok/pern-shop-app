import { Delivery } from '../deliveries/delivery.model';
import { SmTradeWithoutPrice } from '../trades/trade.model';

export interface MarketDelivery extends Delivery {
  trade: SmTradeWithoutPrice;
}
