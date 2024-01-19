import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Storage } from '../../features/storages/storage.entity';
import {
  MAX_COORDINATE_VALUE,
  MIN_COORDINATE_VALUE,
} from '../../common/constants';

define(Storage, (faker: Faker) => {
  const storage = new Storage();
  storage.name = faker.address.city();
  storage.image = '';
  storage.video = '';
  storage.description = '';
  storage.x =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  storage.y =
    Math.floor(
      Math.random() * (MAX_COORDINATE_VALUE - MIN_COORDINATE_VALUE + 1),
    ) + MIN_COORDINATE_VALUE;
  storage.price = Math.floor(Math.random() * 32) + 1;
  return storage;
});
