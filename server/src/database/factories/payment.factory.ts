import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Payment } from '../../features/payments/payment.entity';

define(Payment, (faker: Faker) => {
  const payment = new Payment();
  payment.sum = Math.floor(Math.random() * 400) + 1;
  payment.description = faker.lorem.sentence(3);
  return payment;
});
