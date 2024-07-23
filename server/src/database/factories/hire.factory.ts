import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Hire } from '../../features/hires/hire.entity';
import { getDateWeekAfter } from '../../common/utils';

define(Hire, (faker: Faker) => {
  const hire = new Hire();
  hire.completedAt = getDateWeekAfter();
  return hire;
});
