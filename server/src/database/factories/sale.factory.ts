import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Sale } from '../../features/sales/sale.entity';

define(Sale, (faker: Faker) => {
  const sale = new Sale();
  sale.amount = Math.floor(Math.random() * 16) + 1;
  return sale;
});
