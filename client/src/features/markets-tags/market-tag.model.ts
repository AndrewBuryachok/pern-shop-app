import { SmTag, Tag } from '../tags/tag.model';
import { MdMarket } from '../markets/market.model';

export interface SmMarketTag extends SmTag {}

export interface MarketTag extends Tag {
  market: MdMarket;
  stalls: number;
}
