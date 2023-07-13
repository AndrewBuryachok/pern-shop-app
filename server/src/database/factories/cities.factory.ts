import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { City } from '../../features/cities/city.entity';

define(City, (faker: Faker) => {
  const city = new City();
  city.name = faker.address.city();
  city.x = Math.floor(Math.random() * 2000) - 1000;
  city.y = Math.floor(Math.random() * 2000) - 1000;
  return city;
});
