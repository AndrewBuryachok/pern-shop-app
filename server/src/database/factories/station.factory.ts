import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Station } from '../../features/stations/station.entity';
import {
  MAX_COORDINATE_VALUE,
  MIN_COORDINATE_VALUE,
} from '../../common/constants';

define(Station, (faker: Faker) => {
  const station = new Station();
  station.name = faker.address.city();
  station.image = '';
  station.video = '';
  station.description = '';
  station.x =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  station.y =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  station.price = Math.floor(Math.random() * 32) + 1;
  return station;
});
