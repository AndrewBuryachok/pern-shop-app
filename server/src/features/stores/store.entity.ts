import { Container } from '../containers/container.entity';
import { Market } from '../markets/market.entity';

export class Store extends Container {
  marketId: number;
  market: Market;
}
