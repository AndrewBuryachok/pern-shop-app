import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Delivery } from '../../features/deliveries/delivery.entity';
import {
  MAX_AMOUNT_VALUE,
  MAX_INTAKE_VALUE,
  MAX_ITEM_VALUE,
  MAX_KIT_VALUE,
  MAX_RATE_VALUE,
} from '../../common/constants';

define(Delivery, (faker: Faker) => {
  const delivery = new Delivery();
  delivery.item = Math.floor(Math.random() * MAX_ITEM_VALUE) + 1;
  delivery.description = '-';
  delivery.amount = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  delivery.intake = Math.floor(Math.random() * MAX_INTAKE_VALUE) + 1;
  delivery.kit = Math.floor(Math.random() * MAX_KIT_VALUE) + 1;
  delivery.price = Math.floor(Math.random() * 200) + 1;
  delivery.status = Math.floor(Math.random() * 4) + 1;
  if (delivery.status === 4 && Math.random() > 0.5) {
    delivery.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
  }
  return delivery;
});
