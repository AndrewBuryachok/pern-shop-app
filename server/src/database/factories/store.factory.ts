import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Store } from '../../features/stores/store.entity';

define(Store, (faker: Faker) => {
  const store = new Store();
  const reserved = !!Math.floor(Math.random() * 2);
  if (reserved) {
    store.reservedAt = new Date();
  }
  return store;
});
