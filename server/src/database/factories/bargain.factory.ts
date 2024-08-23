import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Bargain } from '../../features/bargains/bargain.entity';
import { MAX_RATE_VALUE } from '../../common/constants';

define(Bargain, (faker: Faker) => {
  const bargain = new Bargain();
  if (Math.random() > 0.5) {
    bargain.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
  }
  return bargain;
});
