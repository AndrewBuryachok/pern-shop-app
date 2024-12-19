import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Stall } from '../../features/stalls/stall.entity';

define(Stall, (faker: Faker) => {
  const stall = new Stall();
  return stall;
});
