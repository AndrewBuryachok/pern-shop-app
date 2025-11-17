import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { StorageTag } from '../../features/storages-tags/storage-tag.entity';

define(StorageTag, () => {
  const storage = new StorageTag();
  storage.name = faker.helpers.arrayElement(['Економ', 'Комфорт', 'Преміум']);
  storage.price = Math.floor(Math.random() * 32) + 1;
  return storage;
});
