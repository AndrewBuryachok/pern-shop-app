import { Container } from '../containers/container.model';
import { MdMarket, SmMarket } from '../markets/market.model';

export interface SmStore extends Container {}

export interface MdStore extends SmStore {
  market: SmMarket;
}

export interface LgStore extends SmStore {
  market: MdMarket;
}

export interface Store extends LgStore {
  reservedUntil?: Date;
}
