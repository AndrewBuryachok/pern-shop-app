import { Container } from '../containers/container.model';
import { MdMarket, SmMarket } from '../markets/market.model';
import { SmMarketTag } from '../markets-tags/market-tag.model';

export interface SmStall extends Container {}

export interface MdStall extends SmStall {
  market: SmMarket;
}

export interface LgStall extends SmStall {
  market: MdMarket;
}

export interface Stall extends LgStall {
  marketTag: SmMarketTag;
  reservedUntil?: Date;
}
