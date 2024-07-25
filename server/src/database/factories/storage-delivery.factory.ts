import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { StorageDelivery } from '../../features/storages-deliveries/storage-delivery.entity';
import { Status } from '../../features/transportations/status.enum';
import { MAX_RATE_VALUE } from '../../common/constants';

define(StorageDelivery, (faker: Faker) => {
  const storageDelivery = new StorageDelivery();
  storageDelivery.price = Math.floor(Math.random() * 200) + 1;
  storageDelivery.status = Math.floor(Math.random() * 4) + 1;
  if (storageDelivery.status === Status.COMPLETED) {
    storageDelivery.completedAt = new Date();
    if (Math.random() > 0.5) {
      storageDelivery.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
    }
  }
  return storageDelivery;
});
