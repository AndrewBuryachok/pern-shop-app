import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Delivery } from '../../features/deliveries/delivery.entity';
import { Status } from '../../features/transportations/status.enum';
import { MAX_RATE_VALUE } from '../../common/constants';

define(Delivery, (faker: Faker) => {
  const delivery = new Delivery();
  delivery.status = Math.floor(Math.random() * 4) + 1;
  if (delivery.status === Status.COMPLETED) {
    delivery.completedAt = new Date();
    if (Math.random() > 0.5) {
      delivery.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
    }
  }
  return delivery;
});
