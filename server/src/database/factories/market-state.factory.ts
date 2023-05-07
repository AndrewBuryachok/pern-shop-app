import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { MarketState } from '../../features/markets/market-state.entity';

define(MarketState, (faker: Faker) => {
  const marketState = new MarketState();
  return marketState;
});
