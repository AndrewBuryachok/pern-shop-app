import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Lease } from '../../features/leases/lease.entity';
import { getDateWeekAfter } from '../../common/utils';

define(Lease, (faker: Faker) => {
  const lease = new Lease();
  lease.completedAt = getDateWeekAfter();
  return lease;
});
