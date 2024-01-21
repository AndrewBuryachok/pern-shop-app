import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Rent } from '../../features/rents/rent.entity';
import { getDateWeekAfter } from '../../common/utils';

define(Rent, (faker: Faker) => {
  const rent = new Rent();
  rent.completedAt = getDateWeekAfter();
  return rent;
});
