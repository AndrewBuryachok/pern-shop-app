import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Shop } from '../../features/shops/shop.entity';

define(Shop, (faker: Faker) => {
  const shop = new Shop();
  shop.name = faker.lorem.word();
  shop.x = Math.floor(Math.random() * 2000) - 1000;
  shop.y = Math.floor(Math.random() * 2000) - 1000;
  return shop;
});
