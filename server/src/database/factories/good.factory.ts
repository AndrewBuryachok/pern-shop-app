import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Good } from '../../features/goods/good.entity';

define(Good, (faker: Faker) => {
  const good = new Good();
  good.item = Math.floor(Math.random() * 1050) + 1;
  good.description = faker.lorem.sentence(3);
  good.amount = Math.floor(Math.random() * 27) + 1;
  good.intake = Math.floor(Math.random() * 64) + 1;
  good.kit = Math.floor(Math.random() * 3) + 1;
  good.price = Math.floor(Math.random() * 200) + 1;
  return good;
});
