import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Trade } from '../../features/trades/trade.entity';

define(Trade, (faker: Faker) => {
  const trade = new Trade();
  return trade;
});
