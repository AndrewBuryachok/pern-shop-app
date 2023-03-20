import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Rent } from '../../features/rents/rent.entity';

define(Rent, (faker: Faker) => {
  const rent = new Rent();
  return rent;
});
