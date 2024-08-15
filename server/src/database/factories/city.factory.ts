import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { City } from '../../features/cities/city.entity';
import {
  MAX_COORDINATE_VALUE,
  MIN_COORDINATE_VALUE,
} from '../../common/constants';

define(City, (faker: Faker) => {
  const city = new City();
  city.name = faker.address.city();
  city.image = '';
  city.video = '';
  city.description = '';
  city.x =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  city.y =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  return city;
});
