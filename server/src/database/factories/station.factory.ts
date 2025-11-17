import { faker } from '@faker-js/faker/locale/uk';
import { define } from 'typeorm-seeding';
import { Station } from '../../features/stations/station.entity';
import {
  MAX_COORDINATE_VALUE,
  MIN_COORDINATE_VALUE,
} from '../../common/constants';

define(Station, () => {
  const station = new Station();
  station.name = `Поштомат ${faker.address.cityName()}`;
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
