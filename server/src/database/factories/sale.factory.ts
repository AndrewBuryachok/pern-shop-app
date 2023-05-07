import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Sale } from '../../features/sales/sale.entity';

define(Sale, (faker: Faker) => {
  const sale = new Sale();
  return sale;
});
