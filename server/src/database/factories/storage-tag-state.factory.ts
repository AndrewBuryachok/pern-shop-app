import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { StorageTagState } from '../../features/storages-tags/storage-tag-state.entity';

define(StorageTagState, (faker: Faker) => {
  const storageTagState = new StorageTagState();
  return storageTagState;
});
