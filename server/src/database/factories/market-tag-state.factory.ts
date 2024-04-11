import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { MarketTagState } from '../../features/markets-tags/market-tag-state.entity';

define(MarketTagState, (faker: Faker) => {
  const marketTagState = new MarketTagState();
  return marketTagState;
});
