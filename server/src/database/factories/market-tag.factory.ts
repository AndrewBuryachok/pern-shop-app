import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { MarketTag } from '../../features/markets-tags/market-tag.entity';

define(MarketTag, () => {
  const market = new MarketTag();
  market.name = faker.helpers.arrayElement(['Економ', 'Комфорт', 'Преміум']);
  market.price = Math.floor(Math.random() * 32) + 1;
  return market;
});
