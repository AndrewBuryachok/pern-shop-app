import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Storage } from '../../features/storages/storage.entity';

define(Storage, (faker: Faker) => {
  const storage = new Storage();
  storage.name = faker.address.city();
  storage.x = Math.floor(Math.random() * 2000) - 1000;
  storage.y = Math.floor(Math.random() * 2000) - 1000;
  storage.price = Math.floor(Math.random() * 32) + 1;
  return storage;
});
