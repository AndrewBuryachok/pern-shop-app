import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Market } from '../../features/markets/market.entity';

define(Market, (faker: Faker) => {
  const market = new Market();
  market.name = faker.lorem.word();
  market.x = Math.floor(Math.random() * 2000) - 1000;
  market.y = Math.floor(Math.random() * 2000) - 1000;
  market.price = Math.floor(Math.random() * 32) + 1;
  return market;
});
