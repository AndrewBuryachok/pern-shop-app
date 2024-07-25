import { Haulage } from '../haulages/haulage.model';
import { SmTradeWithoutPrice } from '../trades/trade.model';

export interface MarketDelivery extends Haulage {
  trade: SmTradeWithoutPrice;
}
