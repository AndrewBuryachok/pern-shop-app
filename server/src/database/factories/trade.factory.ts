import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Trade } from '../../features/trades/trade.entity';

define(Trade, (faker: Faker) => {
  const trade = new Trade();
  if (Math.random() > 0.5) {
    trade.rate = Math.floor(Math.random() * 5) + 1;
  }
  return trade;
});
