import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Exchange } from '../../features/exchanges/exchange.entity';

define(Exchange, (faker: Faker) => {
  const exchange = new Exchange();
  exchange.sum = Math.floor(Math.random() * 1000) + 1;
  exchange.type = Math.floor(Math.random() * 6) !== 0;
  return exchange;
});
