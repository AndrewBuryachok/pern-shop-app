import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Farm } from '../../features/farms/farm.entity';
import {
  MAX_COORDINATE_VALUE,
  MIN_COORDINATE_VALUE,
} from '../../common/constants';

define(Farm, (faker: Faker) => {
  const farm = new Farm();
  farm.name = faker.address.city();
  farm.description = '';
  farm.x =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  farm.y =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  return farm;
});
