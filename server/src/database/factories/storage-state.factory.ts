import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { StorageState } from '../../features/storages/storage-state.entity';

define(StorageState, (faker: Faker) => {
  const storageState = new StorageState();
  return storageState;
});
