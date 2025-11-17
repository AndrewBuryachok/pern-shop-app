import { faker } from '@faker-js/faker/locale/uk';
import { define } from 'typeorm-seeding';
import { Storage } from '../../features/storages/storage.entity';
import {
  MAX_COORDINATE_VALUE,
  MIN_COORDINATE_VALUE,
} from '../../common/constants';

define(Storage, () => {
  const storage = new Storage();
  storage.name = `Склад ${faker.address.cityName()}`;
  storage.description = '';
  storage.x =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  storage.y =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  return storage;
});
