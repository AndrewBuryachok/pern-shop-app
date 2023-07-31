import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Delivery } from '../../features/deliveries/delivery.entity';

define(Delivery, (faker: Faker) => {
  const delivery = new Delivery();
  delivery.item = Math.floor(Math.random() * 1418) + 1;
  delivery.description = '-';
  delivery.amount = Math.floor(Math.random() * 27) + 1;
  delivery.intake = Math.floor(Math.random() * 64) + 1;
  delivery.kit = Math.floor(Math.random() * 3) + 1;
  delivery.price = Math.floor(Math.random() * 200) + 1;
  delivery.status = Math.floor(Math.random() * 4) + 1;
  if (delivery.status === 4 && Math.random() > 0.5) {
    delivery.rate = Math.floor(Math.random() * 5) + 1;
  }
  return delivery;
});
