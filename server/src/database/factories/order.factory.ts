import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Order } from '../../features/orders/order.entity';
import {
  MAX_AMOUNT_VALUE,
  MAX_ITEM_VALUE,
  MAX_KIT_VALUE,
  MAX_RATE_VALUE,
} from '../../common/constants';

define(Order, (faker: Faker) => {
  const order = new Order();
  order.item = Math.floor(Math.random() * MAX_ITEM_VALUE) + 1;
  order.description = '-';
  order.amount = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  order.intake = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  order.kit = Math.floor(Math.random() * MAX_KIT_VALUE) + 1;
  order.price = Math.floor(Math.random() * 200) + 1;
  order.status = Math.floor(Math.random() * 4) + 1;
  if (order.status === 4 && Math.random() > 0.5) {
    order.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
  }
  return order;
});
