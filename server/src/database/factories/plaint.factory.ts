import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Plaint } from '../../features/plaints/plaint.entity';

define(Plaint, (faker: Faker) => {
  const plaint = new Plaint();
  plaint.senderDescription = faker.lorem.sentence(3);
  const executed = !!Math.floor(Math.random() * 2);
  if (executed) {
    plaint.receiverDescription = faker.lorem.sentence(3);
    plaint.executedAt = new Date();
  }
  const completed = !!Math.floor(Math.random() * 2);
  if (executed && completed) {
    plaint.executorDescription = faker.lorem.sentence(3);
    plaint.completedAt = new Date();
  }
  return plaint;
});
