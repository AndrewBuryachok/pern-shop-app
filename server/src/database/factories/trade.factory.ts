import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Trade } from '../../features/trades/trade.entity';
import { MAX_RATE_VALUE } from '../../common/constants';

define(Trade, (faker: Faker) => {
  const trade = new Trade();
  if (Math.random() > 0.5) {
    trade.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
  }
  return trade;
});
