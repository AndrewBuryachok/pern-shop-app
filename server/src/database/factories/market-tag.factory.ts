import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { MarketTag } from '../../features/markets-tags/market-tag.entity';

define(MarketTag, (faker: Faker) => {
  const market = new MarketTag();
  market.name = faker.address.city();
  market.price = Math.floor(Math.random() * 32) + 1;
  return market;
});
