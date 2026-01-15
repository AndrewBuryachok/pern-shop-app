import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Transaction } from '../../features/transactions/transaction.entity';

define(Transaction, (faker: Faker) => {
  const transaction = new Transaction();
  return transaction;
});
