import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Transaction } from '../../features/transactions/transaction.entity';

define(Transaction, (faker: Faker) => {
  const transaction = new Transaction();
  transaction.sum = Math.floor(Math.random() * 400) + 1;
  transaction.description = faker.lorem.words(2);
  return transaction;
});
