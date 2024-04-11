import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { StorageTag } from '../../features/storages-tags/storage-tag.entity';

define(StorageTag, (faker: Faker) => {
  const storage = new StorageTag();
  storage.name = faker.address.city();
  storage.price = Math.floor(Math.random() * 32) + 1;
  return storage;
});
