import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Order } from '../../features/orders/order.entity';
import { Status } from '../../features/transportations/status.enum';
import {
  MAX_AMOUNT_VALUE,
  MAX_KIT_VALUE,
  MAX_RATE_VALUE,
} from '../../common/constants';
import { Item } from '../../features/things/item.enum';

define(Order, () => {
  const order = new Order();
  order.item = faker.helpers.arrayElement(Object.values(Item));
  order.description = '';
  order.amount = Math.floor(Math.random() * MAX_AMOUNT_VALUE) + 1;
  order.kit = Math.floor(Math.random() * MAX_KIT_VALUE) + 1;
  order.intake =
    order.kit !== 1 ? 1 : faker.helpers.arrayElement([1, 16, 32, 64]);
  order.status = Math.floor(Math.random() * 4) + 1;
  if (order.status === Status.COMPLETED) {
    order.completedAt = new Date();
    if (Math.random() > 0.5) {
      order.rate = Math.floor(Math.random() * MAX_RATE_VALUE) + 1;
    }
  }
  return order;
});
