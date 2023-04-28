import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Lease } from '../../features/leases/lease.entity';

define(Lease, (faker: Faker) => {
  const lease = new Lease();
  return lease;
});
