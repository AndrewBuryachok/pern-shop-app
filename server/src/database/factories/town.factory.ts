import { faker } from '@faker-js/faker/locale/uk';
import { define } from 'typeorm-seeding';
import { Town } from '../../features/towns/town.entity';
import {
  MAX_COORDINATE_VALUE,
  MIN_COORDINATE_VALUE,
} from '../../common/constants';

define(Town, () => {
  const town = new Town();
  town.name = `Місто ${faker.address.cityName()}`;
  town.description = '';
  town.x =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  town.y =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  return town;
});
