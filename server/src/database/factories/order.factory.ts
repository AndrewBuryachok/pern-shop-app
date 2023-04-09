import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Order } from '../../features/orders/order.entity';

define(Order, (faker: Faker) => {
  const order = new Order();
  order.item = Math.floor(Math.random() * 1050) + 1;
  order.description = faker.lorem.sentence(3);
  order.amount = Math.floor(Math.random() * 16) + 1;
  order.intake = Math.floor(Math.random() * 64) + 1;
  order.kit = Math.floor(Math.random() * 3) + 1;
  order.price = Math.floor(Math.random() * 200) + 1;
  order.status = Math.floor(Math.random() * 4) + 1;
  return order;
});
