import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Attitude } from '../../features/reports/attitude.entity';

define(Attitude, (faker: Faker) => {
  const attitude = new Attitude();
  attitude.type = !!Math.floor(Math.random() * 2);
  return attitude;
});
