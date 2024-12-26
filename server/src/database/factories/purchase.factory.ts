import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Purchase } from '../../features/purchases/purchase.entity';
import { MAX_RATE_VALUE } from '../../common/constants';

define(Purchase, (faker: Faker) => {
  const purchase = new Purchase();
  if (Math.random() > 0.5) {
    purchase.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
  }
  return purchase;
});
