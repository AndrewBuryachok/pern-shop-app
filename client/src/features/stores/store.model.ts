import { Container } from '../containers/container.model';
import { MdMarket, SmMarket } from '../markets/market.model';
import { SmMarketTag } from '../markets-tags/market-tag.model';

export interface SmStore extends Container {}

export interface MdStore extends SmStore {
  market: SmMarket;
}

export interface LgStore extends SmStore {
  market: MdMarket;
}

export interface LgStoreWithTag extends LgStore {
  marketTag: SmMarketTag;
}

export interface Store extends LgStoreWithTag {
  reservedUntil?: Date;
}
