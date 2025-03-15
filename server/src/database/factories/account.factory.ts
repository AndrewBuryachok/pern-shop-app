import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Account } from '../../features/cards/account.entity';
import { MAX_COLOR_VALUE } from '../../common/constants';

define(Account, (faker: Faker) => {
  const account = new Account();
  account.name = faker.finance.account(4);
  account.color = Math.floor(Math.random() * MAX_COLOR_VALUE) + 1;
  account.balance = 0;
  return account;
});
