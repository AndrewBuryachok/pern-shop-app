import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Exchange } from '../../features/exchanges/exchange.entity';

define(Exchange, (faker: Faker) => {
  const exchange = new Exchange();
  exchange.sum = Math.floor(Math.random() * 400) + 1;
  exchange.type = !!Math.floor(Math.random() * 2);
  return exchange;
});
