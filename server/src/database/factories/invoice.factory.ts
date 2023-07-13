import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Invoice } from '../../features/invoices/invoice.entity';

define(Invoice, (faker: Faker) => {
  const invoice = new Invoice();
  invoice.sum = Math.floor(Math.random() * 400) + 1;
  invoice.description = faker.finance.transactionType();
  return invoice;
});
