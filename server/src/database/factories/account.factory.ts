import { faker } from '@faker-js/faker/locale/uk';
import { define } from 'typeorm-seeding';
import { Account } from '../../features/cards/account.entity';
import { MAX_COLOR_VALUE } from '../../common/constants';

define(Account, () => {
  const account = new Account();
  account.name = faker.address.streetName();
  account.color = Math.floor(Math.random() * MAX_COLOR_VALUE) + 1;
  account.balance = 0;
  return account;
});
