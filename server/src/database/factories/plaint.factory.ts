import { Faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { Plaint } from '../../features/plaints/plaint.entity';

define(Plaint, (faker: Faker) => {
  const plaint = new Plaint();
  plaint.title = faker.lorem.sentence(3);
  plaint.senderText = faker.lorem.sentence(7);
  const executed = !!Math.floor(Math.random() * 2);
  if (executed) {
    plaint.receiverText = faker.lorem.sentence(7);
    plaint.executedAt = new Date();
  }
  const completed = !!Math.floor(Math.random() * 2);
  if (executed && completed) {
    plaint.executorText = faker.lorem.sentence(7);
    plaint.completedAt = new Date();
  }
  return plaint;
});
