import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Sale } from '../../features/sales/sale.entity';

define(Sale, (faker: Faker) => {
  const sale = new Sale();
  if (Math.random() > 0.5) {
    sale.rate = Math.floor(Math.random() * 5) + 1;
  }
  return sale;
});
